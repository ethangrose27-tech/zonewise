import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // DBPR License Verification Proxy
  app.get("/api/verify-license", async (req, res) => {
    const licenseNumber = (req.query.license as string || "").trim().toUpperCase();

    if (!licenseNumber) {
      return res.status(400).json({ error: "License number is required" });
    }

    // Validate FL license format (e.g., CGC1234567, CCC1234567, EC13001234, etc.)
    const validFormat = /^[A-Z]{2,4}\d{5,10}$/.test(licenseNumber);
    if (!validFormat) {
      return res.status(400).json({
        error: "Invalid license format. Expected format like CGC1234567, CCC1234567, EC13001234",
      });
    }

    try {
      // Attempt to fetch from DBPR
      const searchUrl = `https://www.myfloridalicense.com/wl11.asp?mode=2&search=LicNbr&SID=&brd=&typ=&LicNbr=${encodeURIComponent(licenseNumber)}&action2=Submit`;

      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`DBPR returned ${response.status}`);
      }

      const html = await response.text();

      // Parse the HTML response for license data
      const result = parseDBPRResponse(html, licenseNumber);
      return res.json(result);
    } catch (err: any) {
      console.warn("DBPR fetch failed:", err.message);

      // Return a fallback response with a direct link
      return res.json({
        status: "unavailable",
        licenseNumber,
        message: "Unable to verify in real-time. Use the official DBPR portal.",
        verifyUrl: `https://www.myfloridalicense.com/wl11.asp?mode=0&SID=`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return httpServer;
}

function parseDBPRResponse(html: string, licenseNumber: string): any {
  const timestamp = new Date().toISOString();

  // Check if results were found
  const noResults = html.includes("No Records Found") || html.includes("0 Records");
  if (noResults) {
    return {
      status: "not_found",
      licenseNumber,
      message: "No license found with this number in the FL DBPR database.",
      verifyUrl: `https://www.myfloridalicense.com/wl11.asp?mode=0&SID=`,
      timestamp,
    };
  }

  // Try to extract license details from HTML tables
  let name = "";
  let licenseType = "";
  let licenseStatus = "";
  let expires = "";
  let address = "";
  let rank = "";

  // Extract data using regex patterns from the DBPR HTML table
  const nameMatch = html.match(/<td[^>]*class="[^"]*Results[^"]*"[^>]*>([^<]+)<\/td>/gi);
  const statusMatch = html.match(/(?:Current,\s*Active|Current,\s*Inactive|Delinquent|Null\s*&\s*Void|Suspended|Revoked|Voluntary\s*Inactive|Active|Inactive)/i);
  const typeMatch = html.match(/(?:Certified\s+(?:General|Building|Residential|Roofing|Plumbing|Mechanical|Electrical|Pool\/Spa|Solar|Underground Utility|Sheet Metal|Pollutant Storage|Glass & Glazing)\s+Contractor|Registered\s+\w+\s+Contractor|Professional\s+Surveyor|Licensed\s+Architect)/i);

  if (statusMatch) {
    licenseStatus = statusMatch[0].trim();
  }
  if (typeMatch) {
    licenseType = typeMatch[0].trim();
  }

  // Try to extract name from various patterns
  const tdPattern = /<td[^>]*>([A-Z][A-Z\s,.'()-]+(?:INC|LLC|CORP|CO|COMPANY|ENTERPRISES|SERVICES|CONSTRUCTION|ROOFING|PLUMBING|ELECTRIC|CONTRACTING)?[^<]*)<\/td>/gi;
  const tdMatches = html.match(tdPattern);
  if (tdMatches && tdMatches.length > 0) {
    // First meaningful text cell is usually the licensee name
    for (const match of tdMatches) {
      const text = match.replace(/<[^>]+>/g, "").trim();
      if (text.length > 3 && !text.match(/^\d/) && text !== licenseNumber && !text.match(/^(Current|Active|Inactive|Back|New)/)) {
        name = text;
        break;
      }
    }
  }

  // Check for common status indicators
  const isActive = /Current,?\s*Active/i.test(html) || (/Active/i.test(html) && !/Inactive/i.test(html));
  const isInactive = /Inactive/i.test(html);
  const isDelinquent = /Delinquent/i.test(html);
  const isRevoked = /Revoked/i.test(html);
  const isSuspended = /Suspended/i.test(html);
  const isNullVoid = /Null\s*(?:&|and)\s*Void/i.test(html);

  let computedStatus = "unknown";
  if (isRevoked) computedStatus = "revoked";
  else if (isSuspended) computedStatus = "suspended";
  else if (isNullVoid) computedStatus = "null_void";
  else if (isDelinquent) computedStatus = "delinquent";
  else if (isInactive) computedStatus = "inactive";
  else if (isActive) computedStatus = "active";

  // If we found any status info, it means we have results
  if (computedStatus !== "unknown" || name || licenseType) {
    return {
      status: computedStatus,
      licenseNumber,
      name: name || "See DBPR portal for details",
      licenseType: licenseType || "Construction Contractor",
      licenseStatus: licenseStatus || computedStatus,
      expires,
      rank,
      verifyUrl: `https://www.myfloridalicense.com/wl11.asp?mode=0&SID=`,
      timestamp,
    };
  }

  // If we got HTML but couldn't parse it well, still indicate we got a response
  if (html.length > 500 && html.includes("wl11.asp")) {
    return {
      status: "found",
      licenseNumber,
      message: "License found in DBPR database. Click to view full details.",
      verifyUrl: `https://www.myfloridalicense.com/wl11.asp?mode=0&SID=`,
      timestamp,
    };
  }

  return {
    status: "unavailable",
    licenseNumber,
    message: "Could not parse DBPR response. Verify directly.",
    verifyUrl: `https://www.myfloridalicense.com/wl11.asp?mode=0&SID=`,
    timestamp,
  };
}
