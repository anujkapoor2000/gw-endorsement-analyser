# GW Endorsement Impact Analyser
### NTT DATA -- Guidewire AMS Accelerator

AI-powered mid-term endorsement intelligence for Guidewire PolicyCenter. When an agent requests any mid-term change, the Endorsement Impact Analyser instantly calculates the premium adjustment, identifies coverage gaps the change creates, flags new risk exposures, lists underwriting referral requirements, and surfaces compliance obligations -- before the agent binds the endorsement.

---

## What It Does

A mid-term endorsement is any change to a policy between its effective and expiration dates. Every change creates ripple effects the agent may not anticipate:

- **Adding a driver** -- youthful operator surcharges, missing accident forgiveness, MVR requirements
- **Increasing dwelling limits** -- Coverage C not auto-adjusting, inflation guard inadequacy, hurricane deductible recalculation
- **Adding a pool** -- critical liability gap ($300k is dangerously low), FL Pool Safety Act compliance, need for umbrella
- **Adding a commercial vehicle** -- FMCSA 4-vehicle threshold, cargo liability gap, fleet driver schedule inadequacy

The analyser surfaces all of this in under 5 seconds rather than relying on an experienced agent to know every implication.

---

## The 5-Tab Result View

After analysis, every endorsement produces five tabs:

| Tab | What It Shows |
|---|---|
| **Premium Breakdown** | Every coverage line with its individual change, the reason behind the change (FL rate table, youthful driver factor, etc.), and the final pro-rata amount due at endorsement effective date |
| **Coverage Gaps** | Gaps the endorsement creates -- missing coverage, inadequate limits, coverage that should auto-adjust but doesn't |
| **New Exposures** | New risk exposures introduced by the change that the agent should discuss with the insured |
| **UW Flags** | Items that require underwriting referral or documentation before binding |
| **Compliance Notes** | Florida statute references, federal regulation citations, forms that must be re-issued |

---

## Endorsements Loaded in the PoC

### Personal Auto (PA-2024-88341 -- Marcus Reid)

**Add Driver (Tyler Reid, Age 20)**
- Pro-rata impact: **+$312** due now / **+$640/yr** annual increase
- CRITICAL: No accident forgiveness on youthful operator
- HIGH: Distracted driving exposure, no telematics endorsement
- UW: MVR required before bind, principal operator designation required

**Increase Liability Limits ($100k/$300k to $250k/$500k)**
- Pro-rata impact: **+$106** due now / **+$218/yr** annual increase
- Umbrella eligibility triggered at new limits
- No new exposures created -- this endorsement improves coverage

### HO-3 Homeowners (HO3-2024-55129 -- Sandra White)

**Increase Dwelling Coverage A ($310k to $380k)**
- Pro-rata impact: **+$197** due now / **+$342/yr** annual increase
- HIGH: Coverage C does NOT auto-adjust -- insured underinsured by $35k
- HIGH: Inflation guard at 4% vs 8.2% FL construction cost inflation
- COMPLIANCE: RCE required, hurricane deductible disclosure form must be re-issued

**Add Swimming Pool (16x32 In-Ground)**
- Pro-rata impact: **+$165** due now / **+$285/yr** annual increase
- CRITICAL: $300k liability limit dangerously inadequate -- pool drowning average claim $2.4M
- CRITICAL: FL Statute 515.29 pool barrier compliance required
- HIGH: No umbrella policy in force
- UW: Referral required, document customer acknowledgment

### Commercial Auto (CA-2024-11203 -- Metro Delivery LLC)

**Add Vehicle (2023 Mercedes-Benz Sprinter 3500)**
- Pro-rata impact: **+$2,118** due now / **+$5,420/yr** annual increase
- CRITICAL: FMCSA 4-vehicle threshold -- federal registration may be required
- HIGH: Cargo liability completely uninsured
- UW: Referral required, DOT compliance check required

**Add Employee Driver (Carlos Mendez, Age 23, CDL Class B)**
- Pro-rata impact: **+$875** due now / **+$2,240/yr** annual increase
- HIGH: FMCSA Driver Qualification File required before operating
- HIGH: Youthful commercial operator 2.8x accident risk

---

## Quick Start -- Run Locally (3 minutes)

**Requires Node.js 18+**  ([nodejs.org](https://nodejs.org))

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
# http://localhost:3000
```

---

## How to Load on a Website

### Option 1 -- Netlify (Easiest, No Account Required)

```bash
# Build the production bundle
npm run build

# The /build folder is now ready to deploy.
# Drag and drop the /build folder to:
# https://app.netlify.com/drop

# That's it. You get a live URL like:
# https://endorsement-analyser-abc123.netlify.app
```

Takes about 2 minutes. No account required for drag-and-drop deploy.

### Option 2 -- Vercel (Best for Ongoing Development)

```bash
# Step 1: Push to GitHub
git init
git add .
git commit -m "Initial commit -- GW Endorsement Impact Analyser"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/gw-endorsement-analyser.git
git push -u origin main

# Step 2: Deploy on Vercel
# Go to: https://vercel.com
# Click: Add New Project
# Import: your GitHub repo
# Click: Deploy
# Live at: https://gw-endorsement-analyser.vercel.app

# Every subsequent git push auto-deploys. Zero maintenance.
```

### Option 3 -- Vercel CLI (60 seconds)

```bash
npm install -g vercel
vercel
# Follow the prompts -- done in 60 seconds
# Vercel detects React automatically
```

### Option 4 -- GitHub Pages

```bash
npm install --save-dev gh-pages

# Add to package.json:
# "homepage": "https://YOUR_USERNAME.github.io/gw-endorsement-analyser",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

npm run deploy
# Live at: https://YOUR_USERNAME.github.io/gw-endorsement-analyser
```

### Option 5 -- AWS S3 + CloudFront (Enterprise)

```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront distribution pointing at S3
# Set default root object to index.html
# Set error page 404 -> /index.html (for React Router)

# Live at your CloudFront domain or custom domain
```

### Option 6 -- Azure Static Web Apps

```bash
# Build
npm run build

# Deploy via Azure CLI
az staticwebapp create \
  --name gw-endorsement-analyser \
  --resource-group your-rg \
  --source https://github.com/YOUR_ORG/gw-endorsement-analyser \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

---

## Adding Your API Key (Phase 2 -- Live Claude Integration)

### Step 1: Get an Anthropic API Key

Go to [console.anthropic.com](https://console.anthropic.com) and create an API key.

### Step 2: Set as Environment Variable

**For Vercel:**
```
Vercel Dashboard -> Your Project -> Settings -> Environment Variables
Name:  REACT_APP_ANTHROPIC_KEY
Value: sk-ant-your-key-here
```

**For local development:**
```bash
# Create .env file in project root (never commit this file)
echo "REACT_APP_ANTHROPIC_KEY=sk-ant-your-key-here" > .env
```

### Step 3: Replace the Static Data Function

In `src/App.js`, find the `runAnalysis` function and replace the static lookup with a live Claude call:

```javascript
async function runAnalysis() {
  setLoading(true);
  setStep("result");

  const prompt = {
    policy: selectedPol,
    endorsement: selectedEnd,
    endorsementDetails: formData,
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: `You are a senior GW AMS insurance analyst. Given a PolicyCenter policy
               and an endorsement request, return ONLY valid JSON with keys:
               endorsementTitle, premiumImpact (annualIncrease, proRataIncrease,
               newAnnualPremium, percentageChange, direction, breakdown[]),
               coverageGaps[] (severity, type, title, detail),
               newExposures[] (severity, exposure, detail),
               uwFlags[], complianceNotes[].
               Be specific about dollar amounts, state statutes, and GW-specific
               implications. Use CRITICAL/HIGH/MEDIUM/LOW for severity.`,
      messages: [{ role: 'user', content: JSON.stringify(prompt) }],
    }),
  });

  const data = await response.json();
  const result = JSON.parse(data.content[0].text);
  setResult(result);
  setLoading(false);
}
```

This single change transforms the PoC into a live AI tool that can analyse **any endorsement on any policy** -- not just the pre-loaded scenarios.

---

## Project Structure

```
gw-endorsement-analyser/
├── src/
│   ├── App.js         <- Full application (all data + UI in one file)
│   └── index.js       <- Entry point
├── public/
│   └── index.html     <- HTML shell
├── package.json
└── README.md          <- This file
```

---

## Production Roadmap

| Phase | What | Timeline |
|---|---|---|
| **PoC (now)** | Static endorsement results for 5 scenarios, full 5-tab UI | Live today |
| **Phase 2** | Live Claude API -- any endorsement on any policy | Week 1-2 |
| **Phase 3** | Connect to PolicyCenter API -- pull live policy data | Week 3-4 |
| **Phase 4** | Rating engine integration -- live premium calculation from GW rate tables | Week 5-6 |
| **Phase 5** | Agent workflow integration -- pre-fill endorsement forms in PolicyCenter | Week 7-8 |
| **Phase 6** | Compliance database -- live statute references by state and product | Week 9-10 |

---

## Deployment Checklist

Before sharing the URL with a client:

- [ ] Run `npm run build` and verify no errors
- [ ] Test all 5 endorsement scenarios end-to-end
- [ ] Verify the 5-tab result view renders correctly on mobile
- [ ] Check that "Start Over" and "Try Another Endorsement" flows work
- [ ] Confirm footer shows the correct NTT DATA branding
- [ ] If using Vercel: set custom domain in Vercel dashboard (optional)
- [ ] If using Netlify: set site name in Netlify dashboard (optional)

---

## NTT DATA -- Guidewire AMS Accelerators 2025

Built with React 18 + Anthropic Claude. Designed for PolicyCenter v10+ on-premise and GW Cloud.
