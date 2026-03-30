import { useState } from "react";

var BLUE   = "#003087";
var LBLUE  = "#0067B1";
var RED    = "#E4002B";
var GREEN  = "#00875A";
var AMBER  = "#FF8B00";
var PURPLE = "#6554C0";
var TEAL   = "#00A896";
var ORANGE = "#FF6B35";
var WHITE  = "#FFFFFF";
var G100   = "#F0F2F5";
var G200   = "#E2E6EC";
var G400   = "#9AAABF";
var G600   = "#5A6A82";
var G800   = "#2C3A4F";

// ── Sample policies ───────────────────────────────────────────────────────────
var POLICIES = [
  {
    id: "PA-2024-88341",
    type: "Personal Auto",
    insured: "Marcus Reid",
    address: "142 Coral Way, Miami FL 33145",
    effectiveDate: "2024-03-15",
    expirationDate: "2025-03-15",
    currentPremium: 1842,
    proRataDays: 187,
    coverages: [
      { name:"Bodily Injury Liability",    limit:"$100k/$300k",  deductible:"None", premium:420 },
      { name:"Property Damage Liability",  limit:"$100,000",     deductible:"None", premium:180 },
      { name:"Uninsured Motorist BI",      limit:"$100k/$300k",  deductible:"None", premium:145 },
      { name:"Comprehensive",              limit:"ACV",          deductible:"$500", premium:280 },
      { name:"Collision",                  limit:"ACV",          deductible:"$500", premium:520 },
      { name:"Medical Payments",           limit:"$5,000",       deductible:"None", premium:97  },
      { name:"Rental Reimbursement",       limit:"$30/day",      deductible:"None", premium:48  },
      { name:"Roadside Assistance",        limit:"Standard",     deductible:"None", premium:32  },
      { name:"Towing and Labor",           limit:"$100",         deductible:"None", premium:20  },
      { name:"Gap Coverage",               limit:"ACV",          deductible:"None", premium:100 },
    ],
    drivers: [
      { name:"Marcus Reid",    age:38, mvr:"Clean",    relationship:"Named Insured" },
      { name:"Diana Reid",     age:36, mvr:"Clean",    relationship:"Spouse"        },
    ],
    vehicles: [
      { year:2022, make:"Honda",   model:"Accord EX",   vin:"1HGCV1F3XNA012345", use:"Commute", miles:12000, garageZip:"33145" },
    ],
  },
  {
    id: "HO3-2024-55129",
    type: "HO-3 Homeowners",
    insured: "Sandra White",
    address: "1842 Palm Grove Drive, Miami FL 33101",
    effectiveDate: "2024-05-01",
    expirationDate: "2025-05-01",
    currentPremium: 2180,
    proRataDays: 211,
    coverages: [
      { name:"Coverage A -- Dwelling",         limit:"$310,000",  deductible:"$1,000", premium:980  },
      { name:"Coverage B -- Other Structures", limit:"$31,000",   deductible:"$1,000", premium:98   },
      { name:"Coverage C -- Personal Property",limit:"$155,000",  deductible:"$1,000", premium:465  },
      { name:"Coverage D -- Loss of Use",      limit:"$62,000",   deductible:"None",   premium:155  },
      { name:"Coverage E -- Personal Liability",limit:"$300,000", deductible:"None",   premium:285  },
      { name:"Coverage F -- Medical Payments", limit:"$5,000",    deductible:"None",   premium:72   },
      { name:"Wind/Hurricane Deductible",      limit:"2% of CovA",deductible:"$6,200", premium:125  },
    ],
    drivers: [],
    vehicles: [],
  },
  {
    id: "CA-2024-11203",
    type: "Commercial Auto",
    insured: "Metro Delivery LLC",
    address: "3200 NW 79th St, Miami FL 33147",
    effectiveDate: "2024-02-01",
    expirationDate: "2025-02-01",
    currentPremium: 18500,
    proRataDays: 143,
    coverages: [
      { name:"Commercial Auto Liability (CSL)", limit:"$1,000,000 CSL", deductible:"None",   premium:8200 },
      { name:"Uninsured/Underinsured Motorist", limit:"$1,000,000 CSL", deductible:"None",   premium:1850 },
      { name:"Commercial Comprehensive",        limit:"ACV",            deductible:"$1,000", premium:2100 },
      { name:"Commercial Collision",            limit:"ACV",            deductible:"$2,500", premium:4800 },
      { name:"Hired Auto Liability",            limit:"$500,000 CSL",   deductible:"None",   premium:820  },
      { name:"Non-Owned Auto Liability",        limit:"$500,000 CSL",   deductible:"None",   premium:730  },
    ],
    drivers: [
      { name:"James Torres",  age:44, mvr:"1 Minor Violation", relationship:"Employee Driver" },
      { name:"Maria Santos",  age:29, mvr:"Clean",             relationship:"Employee Driver" },
    ],
    vehicles: [
      { year:2021, make:"Ford",    model:"Transit 250",    vin:"1FTBW2XM1MKA11111", use:"Commercial Delivery", miles:55000, garageZip:"33147" },
      { year:2020, make:"Ford",    model:"Transit 350",    vin:"1FTBW3XM0LKA22222", use:"Commercial Delivery", miles:71000, garageZip:"33147" },
      { year:2022, make:"Ram",     model:"ProMaster 2500", vin:"3C6TRVDG5NE333333",  use:"Commercial Delivery", miles:38000, garageZip:"33147" },
    ],
  },
];

// ── Endorsement types per policy type ────────────────────────────────────────
var ENDORSEMENT_TYPES = {
  "Personal Auto": [
    { id:"add_driver",       label:"Add a Driver",             icon:"&#128100;", desc:"Add a new driver to the policy" },
    { id:"change_vehicle",   label:"Change / Add Vehicle",     icon:"&#128663;", desc:"Replace or add a vehicle" },
    { id:"increase_limits",  label:"Increase Liability Limits",icon:"&#128205;", desc:"Raise BI/PD/UM limits" },
    { id:"change_address",   label:"Change Garaging Address",  icon:"&#127968;", desc:"Update where the vehicle is kept" },
    { id:"add_coverage",     label:"Add Coverage",             icon:"&#43;",     desc:"Add comprehensive, collision, or other coverage" },
    { id:"change_deductible",label:"Change Deductible",        icon:"&#128179;", desc:"Raise or lower comprehensive/collision deductible" },
  ],
  "HO-3 Homeowners": [
    { id:"increase_dwelling",label:"Increase Dwelling Limit",  icon:"&#127968;", desc:"Raise Coverage A dwelling limit" },
    { id:"add_endorsement",  label:"Add Endorsement",          icon:"&#43;",     desc:"Add scheduled property, umbrella, or other endorsement" },
    { id:"change_address",   label:"Change Mailing Address",   icon:"&#128205;", desc:"Update the insured mailing address" },
    { id:"add_pool",         label:"Add Pool / Trampoline",    icon:"&#128165;", desc:"Declare new pool or trampoline" },
    { id:"change_deductible",label:"Change Wind Deductible",   icon:"&#127788;", desc:"Modify hurricane/wind deductible percentage" },
    { id:"add_remodel",      label:"Declare Home Renovation",  icon:"&#128296;", desc:"Report significant renovation affecting replacement cost" },
  ],
  "Commercial Auto": [
    { id:"add_vehicle",      label:"Add a Vehicle",            icon:"&#128666;", desc:"Add a new commercial vehicle to the fleet" },
    { id:"add_driver",       label:"Add Employee Driver",      icon:"&#128100;", desc:"Add a new employee driver to the fleet" },
    { id:"increase_limits",  label:"Increase Liability Limits",icon:"&#128205;", desc:"Raise CSL or split limits" },
    { id:"change_use",       label:"Change Vehicle Use",       icon:"&#128204;", desc:"Update the use classification of a vehicle" },
    { id:"add_coverage",     label:"Add Hired/Non-Owned Auto", icon:"&#43;",     desc:"Add hired auto or non-owned auto liability" },
    { id:"remove_vehicle",   label:"Remove a Vehicle",         icon:"&#45;",     desc:"Remove a vehicle from the fleet mid-term" },
  ],
};

// ── Static endorsement impact results ────────────────────────────────────────
var ENDORSEMENT_RESULTS = {
  "PA-2024-88341_add_driver": {
    endorsementTitle: "Add Driver -- Tyler Reid (Age 20)",
    processingSteps: [
      "Reading policy PA-2024-88341 driver schedule...",
      "Evaluating new driver MVR and age classification...",
      "Calculating youthful driver surcharge tables...",
      "Running coverage gap and exposure analysis...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 640,
      proRataIncrease: 312,
      newAnnualPremium: 2482,
      percentageChange: 34.7,
      direction: "INCREASE",
      breakdown: [
        { item:"Bodily Injury -- Youthful Driver Surcharge", change:+185, reason:"Age 20 driver adds 44% BI surcharge under FL youthful operator table" },
        { item:"Collision -- Youthful Driver Surcharge",     change:+280, reason:"Collision carries highest surcharge for drivers under 25 (54% factor)" },
        { item:"Comprehensive -- Minor Youthful Surcharge",  change:+85,  reason:"Comprehensive youthful driver factor 30% -- lower than collision" },
        { item:"Medical Payments -- Additional Operator",    change:+45,  reason:"Additional licensed operator adds MedPay exposure base" },
        { item:"Uninsured Motorist -- Driver Count Factor",  change:+45,  reason:"UM driver count factor increases with 3rd household driver" },
      ],
    },
    coverageGaps: [
      { severity:"HIGH",   type:"Coverage Gap",   title:"No Accident Forgiveness on Youthful Operator", detail:"Tyler Reid (20) is not eligible for accident forgiveness under current policy. First at-fault accident will apply full surcharge with no protection. Consider adding Accident Forgiveness endorsement ($120/yr)." },
      { severity:"MEDIUM", type:"Coverage Gap",   title:"Rental Reimbursement Inadequate for Additional Driver", detail:"Current rental limit $30/day may be insufficient if Tyler uses the vehicle as primary driver. Daily rental rates in FL average $55-$75. Consider increasing to $50/day." },
      { severity:"LOW",    type:"Recommendation", title:"Consider Increasing UM Limits",              detail:"With 3 household drivers including a youthful operator, increasing UM/UIM limits from $100k/$300k to $250k/$500k is advisable. Additional cost approximately $95/yr." },
    ],
    newExposures: [
      { severity:"HIGH",   exposure:"Youthful Driver Risk",              detail:"Drivers aged 16-25 are statistically 3x more likely to be involved in a serious accident. Tyler Reid (20) represents a material increase in household exposure, particularly for collision." },
      { severity:"HIGH",   exposure:"Distracted Driving Exposure",       detail:"Florida law allows limited cell phone use for drivers 18+. Youthful operators have 4x higher distracted driving incident rate. No telematics endorsement currently on policy." },
      { severity:"MEDIUM", exposure:"Night Driving Restriction (None)",   detail:"Policy has no night driving restriction endorsement. Some carriers offer a premium reduction of 8-12% for youthful operators with a curfew endorsement. Currently not applicable." },
      { severity:"LOW",    exposure:"Good Student Discount Not Applied",  detail:"If Tyler Reid maintains a 3.0+ GPA, a Good Student Discount of 8-12% may apply. Requires current transcript. Estimated saving: $75-$95/yr." },
    ],
    uwFlags: [
      "MVR required for Tyler Reid before bind -- cannot bind without clean MVR or rated MVR surcharge confirmation",
      "FL youthful operator: verify if Tyler Reid is a resident of the household -- required for FL named insured endorsement",
      "Confirm principal operator designation: if Tyler Reid will be primary driver of a vehicle, designation required",
    ],
    complianceNotes: [
      "FL 627.736: Named driver exclusion not available for resident household members in FL",
      "FL 626.9641: All resident drivers must be listed and rated or formally excluded on policy",
    ],
  },

  "PA-2024-88341_increase_limits": {
    endorsementTitle: "Increase Liability Limits -- $100k/$300k to $250k/$500k",
    processingSteps: [
      "Reading current liability limits from policy PA-2024-88341...",
      "Applying FL rate tables for increased BI/PD/UM limits...",
      "Checking umbrella eligibility threshold requirements...",
      "Running coverage gap analysis for new limit adequacy...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 218,
      proRataIncrease: 106,
      newAnnualPremium: 2060,
      percentageChange: 11.8,
      direction: "INCREASE",
      breakdown: [
        { item:"Bodily Injury -- Limit Increase Factor",    change:+95,  reason:"$100k/$300k to $250k/$500k: FL BI limit factor 1.22x applied to base premium" },
        { item:"Property Damage -- Limit Increase Factor",  change:+28,  reason:"PD limit increase from $100k to $250k: factor 1.16x" },
        { item:"Uninsured Motorist -- Matching UM Increase",change:+82,  reason:"UM limits increased to match new BI limits -- FL UM stacking rules apply" },
        { item:"Property Damage -- Additional $150k Limit", change:+13,  reason:"Additional $150k PD limit band: marginal cost low at higher limit tier" },
      ],
    },
    coverageGaps: [
      { severity:"MEDIUM", type:"Recommendation",  title:"Consider Umbrella Policy to Complete Protection",   detail:"$250k/$500k auto limits are a common trigger point for umbrella eligibility. An umbrella policy ($1M+) starting at ~$220/yr provides protection above these limits. With two drivers and a vehicle, umbrella is strongly recommended." },
      { severity:"LOW",    type:"Coverage Gap",    title:"UM/UIM Limits Still Below Recommended for FL",      detail:"Although UM is now $250k/$500k, FL has a high rate of uninsured drivers (26.7%). Financial planning advisors typically recommend UM equal to 2x net worth for high-asset households. Review adequacy with customer." },
    ],
    newExposures: [
      { severity:"LOW", exposure:"No New Exposures Created", detail:"Increasing liability limits reduces net exposure -- this endorsement improves the insured's coverage position. No new risk exposures are introduced." },
    ],
    uwFlags: [
      "No UW referral required -- limit increase within binding authority for FL personal auto",
      "Confirm UM stacking election on file -- FL requires written stacking election/rejection",
    ],
    complianceNotes: [
      "FL 627.727: UM limits must equal BI limits unless written rejection on file. Confirm UM matches new BI limits.",
      "Pro-rata premium of $106 due at time of endorsement effective date",
    ],
  },

  "HO3-2024-55129_increase_dwelling": {
    endorsementTitle: "Increase Dwelling (Coverage A) -- $310,000 to $380,000",
    processingSteps: [
      "Reading current Coverage A limit from HO3-2024-55129...",
      "Applying FL homeowners rate table for Coverage A increase...",
      "Running coinsurance and dependent coverage recalculation...",
      "Checking state cap compliance for FL dwelling coverage...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 342,
      proRataIncrease: 197,
      newAnnualPremium: 2522,
      percentageChange: 15.7,
      direction: "INCREASE",
      breakdown: [
        { item:"Coverage A -- Dwelling Limit Increase",       change:+221, reason:"$70k additional dwelling at FL base rate $3.16/$1,000 + wind factor" },
        { item:"Coverage B -- Auto-adjust (10% of CovA)",     change:+22,  reason:"Coverage B auto-adjusts to 10% of Coverage A: $38,000 (was $31,000)" },
        { item:"Coverage D -- Auto-adjust (20% of CovA)",     change:+44,  reason:"Coverage D auto-adjusts to 20% of Coverage A: $76,000 (was $62,000)" },
        { item:"Wind/Hurricane Deductible -- Recalculation",  change:+55,  reason:"2% hurricane deductible now applies to $380k: $7,600 deductible (was $6,200)" },
      ],
    },
    coverageGaps: [
      { severity:"HIGH",   type:"Coverage Gap",   title:"Coverage C (Personal Property) NOT Auto-Adjusted",  detail:"Coverage C does not auto-adjust with Coverage A increase. Current $155,000 is 50% of old Coverage A ($310k). At new $380k Coverage A, standard 50% would be $190,000. Customer may be underinsured by $35,000 on personal property." },
      { severity:"HIGH",   type:"Coverage Gap",   title:"Inflation Guard Now Insufficient at Current Rate",   detail:"Policy has 4% inflation guard. With $70,000 increase, annual inflation guard now adds $15,200/yr at 4%. Current FL construction cost inflation is 8.2% (2024). Inflation guard rate should be increased to at least 8%." },
      { severity:"MEDIUM", type:"Compliance",     title:"FL Replacement Cost Verification Required",          detail:"FL 627.7011 requires that dwelling limit represent at least 80% of replacement cost at time of loss. An updated replacement cost estimator (RCE) should be run for the new $380,000 limit to confirm adequacy. Last RCE was at policy inception." },
    ],
    newExposures: [
      { severity:"MEDIUM", exposure:"Hurricane Deductible Increase",        detail:"The 2% hurricane deductible now represents $7,600 (was $6,200). A $1,400 increase in the customer's out-of-pocket exposure in a named storm. Ensure the customer is aware of the deductible recalculation." },
      { severity:"LOW",    exposure:"Increased Ordinance or Law Exposure",   detail:"Higher dwelling value increases the Ordinance or Law exposure. Current 10% OrdinanceLaw limit ($38,000 at new value) may not be sufficient for a full rebuild to current code in Miami-Dade. Consider increasing to 25-50%." },
    ],
    uwFlags: [
      "Coverage A increase from $310k to $380k within binding authority -- no UW referral required",
      "Run updated Replacement Cost Estimator before binding -- document RCE value in file notes",
      "Confirm customer is aware hurricane deductible increases to $7,600 from $6,200",
    ],
    complianceNotes: [
      "FL 627.7011: 80% coinsurance requirement -- confirm new limit represents at least 80% of full replacement cost",
      "FL Hurricane Deductible Disclosure (Form HO0125FL) must be re-issued reflecting new deductible of $7,600",
    ],
  },

  "HO3-2024-55129_add_pool": {
    endorsementTitle: "Declare Swimming Pool -- 16x32 In-Ground Pool",
    processingSteps: [
      "Reading current liability coverages from HO3-2024-55129...",
      "Evaluating pool exposure factors for Miami-Dade FL...",
      "Running liability adequacy and drowning risk analysis...",
      "Checking ordinance compliance requirements for FL pools...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 285,
      proRataIncrease: 165,
      newAnnualPremium: 2465,
      percentageChange: 13.1,
      direction: "INCREASE",
      breakdown: [
        { item:"Coverage E -- Liability Pool Surcharge",       change:+185, reason:"In-ground pool adds 65% surcharge to Section II liability base in FL" },
        { item:"Coverage F -- Medical Payments Pool Factor",   change:+55,  reason:"Pool increases MedPay exposure factor by 76% -- drowning/injury risk" },
        { item:"Other Structures -- Pool Enclosure Add",       change:+45,  reason:"Pool enclosure/fence added to Coverage B other structures schedule" },
      ],
    },
    coverageGaps: [
      { severity:"CRITICAL",type:"Coverage Gap",   title:"Liability Limit $300k INADEQUATE for Pool Exposure",  detail:"A drowning claim involving a minor can easily exceed $1,000,000. The current $300,000 Coverage E limit is severely inadequate for a pool owner. STRONGLY RECOMMEND increasing to $500,000 AND adding a Personal Umbrella Policy of $1M minimum. A pool drowning wrongful death claim averages $2.4M in FL." },
      { severity:"HIGH",   type:"Compliance",     title:"FL Pool Safety Act -- Barrier Requirements",          detail:"Florida Statute 515.29 requires a pool barrier (fence, door alarm, safety cover, or window alarm) for pools accessible to minors. Violation can void coverage for drowning claims. Verify compliance before binding. Required barriers: 4ft+ fence with self-closing/self-latching gate." },
      { severity:"HIGH",   type:"Coverage Gap",   title:"No Umbrella Policy Currently In Force",               detail:"Pool ownership is the #1 reason insurance professionals recommend a Personal Umbrella Policy. The insured currently has no umbrella. Estimated umbrella cost: $185-$285/yr for $1M above $300k auto + homeowners. Gap between current coverage and average pool claim: $700k+" },
      { severity:"MEDIUM", type:"Coverage Gap",   title:"Medical Payments Limit $5,000 Insufficient for Pool", detail:"Pool-related injuries often result in significant medical bills. ER visit + hospitalization for a non-fatal drowning incident can exceed $50,000-$200,000. Consider increasing Coverage F to $25,000-$50,000." },
    ],
    newExposures: [
      { severity:"CRITICAL", exposure:"Drowning Liability -- Minor Children",     detail:"Pools are the leading cause of accidental death for children ages 1-4 in Florida. An attractive nuisance doctrine may create liability even for trespassers. Current $300k limit is materially inadequate." },
      { severity:"HIGH",     exposure:"Pool Party / Social Host Liability",        detail:"Social gatherings at the pool create host liquor liability exposure. If an intoxicated guest drowns or is injured, the homeowner may face liability. Host Liquor Liability endorsement should be considered." },
      { severity:"MEDIUM",   exposure:"Equipment Breakdown -- Pool Pump/Heater",  detail:"Pool equipment (pump, heater, filter) is not covered under standard HO-3 for mechanical breakdown. Equipment Breakdown Coverage endorsement ($35/yr) would cover sudden mechanical failure of pool equipment." },
      { severity:"LOW",      exposure:"Increased Property Tax Assessment",         detail:"An in-ground pool typically increases FL property tax assessment, which may affect homeowners insurance replacement cost calculation at next renewal." },
    ],
    uwFlags: [
      "REFERRAL REQUIRED: Pool addition with current $300k liability limit -- recommend UW review of liability adequacy",
      "Document: Confirm FL pool barrier compliance (Statute 515.29) before binding",
      "Document: Note recommendation to increase Coverage E to $500k and add umbrella",
      "Document: Customer declined/accepted recommendation on record",
    ],
    complianceNotes: [
      "FL Statute 515.29 (Pool Safety): Written verification of barrier compliance required",
      "FL Attractive Nuisance Doctrine: Pool constitutes attractive nuisance -- insurer must be notified",
      "Document customer acknowledgment of coverage recommendation and decision",
    ],
  },

  "CA-2024-11203_add_vehicle": {
    endorsementTitle: "Add Vehicle -- 2023 Mercedes-Benz Sprinter 3500",
    processingSteps: [
      "Reading current fleet schedule from CA-2024-11203...",
      "Classifying new vehicle by GVW and commercial use type...",
      "Applying commercial auto rate tables for 4th fleet vehicle...",
      "Running DOT/FMCSA compliance check for fleet size threshold...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 5420,
      proRataIncrease: 2118,
      newAnnualPremium: 23920,
      percentageChange: 29.3,
      direction: "INCREASE",
      breakdown: [
        { item:"Commercial Auto Liability -- 4th Vehicle",     change:+2100, reason:"Mercedes Sprinter 3500 GVWR 11,030 lbs: Class 4 commercial vehicle. CSL base $2,100/yr at $1M limit" },
        { item:"Commercial Collision -- High Value New Vehicle",change:+1680, reason:"2023 Sprinter 3500 ACV ~$58,000: collision base $1,680/yr at $2,500 deductible" },
        { item:"Commercial Comprehensive -- New Vehicle",      change:+820,  reason:"Comprehensive base $820/yr for Class 4 cargo van with electronics package" },
        { item:"Uninsured Motorist -- Fleet Count Increase",   change:+480,  reason:"UM fleet count factor increases at 4th vehicle -- 1.08x multiplier applied" },
        { item:"Hired/Non-Owned -- Fleet Size Factor",         change:+340,  reason:"H/NOA limits recalculated at 4+ vehicle fleet size -- marginal cost increase" },
      ],
    },
    coverageGaps: [
      { severity:"CRITICAL",type:"Compliance",     title:"FMCSA Registration Required -- Fleet Now 4 Vehicles",  detail:"With 4 commercial vehicles, Metro Delivery LLC crosses the FMCSA threshold for interstate commerce. DOT number registration and FMCSA operating authority may be required depending on routes. Failure to register is a federal violation and can void coverage for interstate accidents." },
      { severity:"HIGH",   type:"Coverage Gap",   title:"Cargo Coverage Not on Policy",                         detail:"The Sprinter 3500 is a cargo van. If Metro Delivery LLC is transporting goods for others (third-party deliveries), Cargo Liability coverage is required. Current policy has NO cargo coverage. A single cargo damage claim could be uninsured." },
      { severity:"HIGH",   type:"Coverage Gap",   title:"New Vehicle Deductible -- $2,500 Collision Exposure",  detail:"A 2023 Mercedes Sprinter 3500 at $58,000 ACV with a $2,500 collision deductible creates significant out-of-pocket exposure. Fleet operators typically use $1,000 deductible on high-value vehicles. Review deductible adequacy." },
      { severity:"MEDIUM", type:"Coverage Gap",   title:"Electronic Logging Device (ELD) Not Scheduled",        detail:"FMCSA requires ELD for drivers operating under HOS (Hours of Service) rules with 4+ vehicle fleets. ELD equipment value should be added to the inland marine schedule. Current commercial auto policy does not cover ELD loss." },
    ],
    newExposures: [
      { severity:"CRITICAL", exposure:"FMCSA Compliance Exposure",              detail:"4-vehicle commercial fleet triggers FMCSA oversight. Non-compliance penalties up to $16,000 per violation. Insurance may be voided for accidents in non-compliant operations." },
      { severity:"HIGH",     exposure:"Cargo Liability -- Uninsured",            detail:"Delivery operations create cargo liability exposure not covered under commercial auto. Third-party cargo damage can result in claims of $10,000-$250,000+ depending on goods transported." },
      { severity:"HIGH",     exposure:"Fleet Maintenance Liability",             detail:"A 4-vehicle fleet requires documented maintenance records under FMCSA rules. Poor maintenance leading to an accident can expose the business to negligent entrustment liability exceeding the CSL limit." },
      { severity:"MEDIUM",   exposure:"Increased Driver Fatigue Risk",           detail:"Operating 4 vehicles with 2 listed drivers suggests drivers may be operating multiple shifts. Driver fatigue is a leading cause of commercial vehicle accidents." },
    ],
    uwFlags: [
      "REFERRAL REQUIRED: 4th commercial vehicle addition -- fleet size triggers UW review",
      "Verify FMCSA/DOT compliance status before binding",
      "Confirm cargo coverage question answered -- cargo liability gap documented",
      "Obtain updated driver list -- 4 vehicles with only 2 listed drivers raises driver schedule adequacy concern",
      "Run MVR on all drivers if not current (within 12 months)",
    ],
    complianceNotes: [
      "FMCSA 49 CFR Part 390: 4+ vehicle fleet may require DOT registration and operating authority",
      "FL 627.7415: Commercial auto policy must list all vehicles regularly operated by employees",
      "Document UW referral outcome before binding new vehicle",
    ],
  },
  "CA-2024-11203_add_driver": {
    endorsementTitle: "Add Employee Driver -- Carlos Mendez (Age 23, CDL Class B)",
    processingSteps: [
      "Reading current driver schedule from CA-2024-11203...",
      "Evaluating CDL Class B endorsement and MVR record...",
      "Applying youthful commercial operator surcharge tables...",
      "Checking FMCSA driver qualification file requirements...",
      "Computing pro-rata premium adjustment...",
    ],
    premiumImpact: {
      annualIncrease: 2240,
      proRataIncrease: 875,
      newAnnualPremium: 20740,
      percentageChange: 12.1,
      direction: "INCREASE",
      breakdown: [
        { item:"Commercial Auto Liability -- Youthful CDL Driver", change:+980, reason:"Age 23 commercial driver: FL youthful commercial operator surcharge 48% on BI base" },
        { item:"Collision -- Youthful Operator Factor",           change:+820, reason:"Youthful commercial operator collision factor 1.37x base rate for Class 4 vehicles" },
        { item:"Comprehensive -- Additional Operator",            change:+240, reason:"Third listed driver adds 8% comprehensive fleet factor" },
        { item:"UM -- Driver Count Factor",                       change:+200, reason:"UM driver count factor at 3rd listed driver: 1.04x multiplier" },
      ],
    },
    coverageGaps: [
      { severity:"HIGH",   type:"Compliance",     title:"FMCSA Driver Qualification File Required",             detail:"Carlos Mendez must have a complete FMCSA Driver Qualification File (DQF) before operating any commercial vehicle. Required documents: CDL, medical certificate, employment application, road test certificate, MVR (past 3 years). Missing DQF can void coverage for accidents." },
      { severity:"MEDIUM", type:"Coverage Gap",   title:"No Accident Forgiveness for Commercial Fleet Drivers",  detail:"The first at-fault accident involving Carlos Mendez will result in a full surcharge at renewal. Consider documenting training programme completion to offset future surcharge." },
    ],
    newExposures: [
      { severity:"HIGH", exposure:"Youthful CDL Driver -- Elevated Accident Risk",   detail:"Commercial drivers under 25 have a 2.8x higher accident rate than drivers 25-50. CDL Class B is appropriate for delivery vehicles but the inexperience factor remains material." },
      { severity:"MEDIUM", exposure:"Hours of Service Compliance",                   detail:"Ensure Carlos Mendez understands FMCSA Hours of Service rules. Violations create regulatory and insurance exposure." },
    ],
    uwFlags: [
      "Obtain complete MVR for Carlos Mendez before binding",
      "Verify FMCSA DQF is complete and on file",
      "Confirm CDL Class B with appropriate endorsements for vehicle types operated",
    ],
    complianceNotes: [
      "FMCSA 49 CFR Part 391: Driver Qualification File required for all CDL drivers in fleet operations",
      "FL 322.61: CDL medical certificate must be current and on file",
    ],
  },
};

// ── Analysis phases ───────────────────────────────────────────────────────────
var PHASES = [
  "Reading policy coverages and current limits...",
  "Evaluating endorsement change request...",
  "Calculating premium impact by coverage line...",
  "Running coverage gap and exposure analysis...",
  "Generating compliance and UW flag review...",
];

var SEV_THEME = {
  CRITICAL: { bg:"#FFF0EB", border:ORANGE, text:ORANGE     },
  HIGH:     { bg:"#FDECEA", border:RED,    text:"#CC0000"  },
  MEDIUM:   { bg:"#FFF8EC", border:AMBER,  text:"#CC6600"  },
  LOW:      { bg:"#E3FCEF", border:GREEN,  text:GREEN      },
};

function NTTLogo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
        <span style={{ fontFamily:"Arial Black,Arial", fontWeight:900, fontSize:20, color:BLUE }}>NTT</span>
        <span style={{ fontFamily:"Arial,sans-serif", fontWeight:700, fontSize:16, color:BLUE }}>DATA</span>
      </div>
      <div style={{ height:2, background:RED, marginTop:2, borderRadius:1 }}/>
    </div>
  );
}

function SevBadge(props) {
  var t = SEV_THEME[props.severity] || SEV_THEME.LOW;
  return (
    <span style={{ fontSize:9, fontWeight:700, color:t.text, background:t.bg, border:"1px solid "+t.border, borderRadius:3, padding:"1px 6px", flexShrink:0 }}>
      {props.severity}
    </span>
  );
}

function PremiumChange(props) {
  var v = props.value;
  var c = v > 0 ? RED : v < 0 ? GREEN : G400;
  var sign = v > 0 ? "+" : "";
  return <span style={{ fontSize:props.size||12, fontWeight:700, color:c }}>{sign}${Math.abs(v).toLocaleString()}</span>;
}

export default function App() {
  var [step,         setStep]         = useState("policy");   // policy | endorsement | form | result
  var [selectedPol,  setSelectedPol]  = useState(null);
  var [selectedEnd,  setSelectedEnd]  = useState(null);
  // eslint-disable-next-line no-unused-vars
  var [formData,     setFormData]     = useState({});
  var [result,       setResult]       = useState(null);
  var [loading,      setLoading]      = useState(false);
  var [phaseIdx,     setPhaseIdx]     = useState(0);
  var [activeTab,    setActiveTab]    = useState("premium");
  var [history,      setHistory]      = useState([]);

  function selectPolicy(pol) {
    setSelectedPol(pol);
    setSelectedEnd(null);
    setResult(null);
    setStep("endorsement");
  }

  function selectEndorsement(end) {
    setSelectedEnd(end);
    setFormData({});
    setResult(null);
    setStep("form");
  }

  function runAnalysis() {
    var key = selectedPol.id + "_" + selectedEnd.id;
    var data = ENDORSEMENT_RESULTS[key];
    if (!data) return;
    setLoading(true);
    setStep("result");
    setActiveTab("premium");
    setPhaseIdx(0);
    var p = 0;
    function tick() {
      p++; setPhaseIdx(p);
      if (p < PHASES.length - 1) setTimeout(tick, 600);
    }
    setTimeout(tick, 600);
    setTimeout(function() {
      setResult(data);
      setHistory(function(prev) {
        return [{ pol:selectedPol.id, end:selectedEnd.label, impact:data.premiumImpact }].concat(prev).slice(0,5);
      });
      setLoading(false);
    }, 3200);
  }

  function reset() { setStep("policy"); setSelectedPol(null); setSelectedEnd(null); setResult(null); setFormData({}); }

  var critCount = result ? result.coverageGaps.concat(result.newExposures).filter(function(x) { return x.severity === "CRITICAL"; }).length : 0;
  var gapCount  = result ? result.coverageGaps.length : 0;
  var expCount  = result ? result.newExposures.length : 0;

  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", background:G100, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ background:WHITE, borderBottom:"3px solid "+BLUE, padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 6px rgba(0,0,0,0.07)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <NTTLogo/>
          <div style={{ width:1, height:30, background:G200 }}/>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:BLUE }}>Endorsement Impact Analyser</div>
            <div style={{ fontSize:10, color:G600 }}>AI-Powered Mid-Term Endorsement Intelligence -- PolicyCenter AMS Accelerator</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:20 }}>
          {[
            { v:POLICIES.length,                                     l:"Policies",     c:BLUE   },
            { v:history.length,                                      l:"Analysed",     c:PURPLE },
            { v:result?result.coverageGaps.length:"--",              l:"Coverage Gaps",c:AMBER  },
            { v:result?(critCount>0?critCount:"0"):"--",             l:"Critical",     c:ORANGE },
          ].map(function(s) {
            return (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:s.c, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:9, color:G400, textTransform:"uppercase", letterSpacing:1 }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress stepper */}
      <div style={{ background:WHITE, borderBottom:"1px solid "+G200, padding:"10px 24px", display:"flex", alignItems:"center", gap:0 }}>
        {["Select Policy","Choose Endorsement","Review Request","Impact Analysis"].map(function(label, i) {
          var stepKeys = ["policy","endorsement","form","result"];
          var isActive = stepKeys.indexOf(step) === i;
          var isDone   = stepKeys.indexOf(step) > i;
          var c = isDone ? GREEN : isActive ? BLUE : G400;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:isDone||isActive?c:G200, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:WHITE }}>
                  {isDone ? "v" : i+1}
                </div>
                <span style={{ fontSize:11, fontWeight:isActive?700:400, color:c }}>{label}</span>
              </div>
              {i < 3 && <div style={{ width:32, height:2, background:isDone?GREEN:G200, margin:"0 8px" }}/>}
            </div>
          );
        })}
        {step !== "policy" && (
          <button onClick={reset} style={{ marginLeft:"auto", fontSize:10, padding:"4px 12px", background:G100, border:"1px solid "+G200, borderRadius:7, color:G600, cursor:"pointer" }}>
            Start Over
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

        {/* STEP 1: Select Policy */}
        {step === "policy" && (
          <div style={{ maxWidth:820 }}>
            <div style={{ fontSize:13, fontWeight:700, color:BLUE, marginBottom:14 }}>Select the policy to endorse:</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {POLICIES.map(function(pol) {
                var typeColor = pol.type==="Personal Auto"?BLUE:pol.type==="HO-3 Homeowners"?TEAL:PURPLE;
                return (
                  <div key={pol.id} onClick={function() { selectPolicy(pol); }}
                    style={{ background:WHITE, border:"1.5px solid "+G200, borderRadius:11, padding:"14px 16px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", transition:"border-color 0.15s" }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor=BLUE; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor=G200; }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:typeColor, fontFamily:"monospace" }}>{pol.id}</span>
                        <span style={{ fontSize:10, color:typeColor, border:"1px solid "+typeColor, borderRadius:4, padding:"1px 7px" }}>{pol.type}</span>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:GREEN }}>${pol.currentPremium.toLocaleString()}/yr</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:G800, marginBottom:4 }}>{pol.insured}</div>
                    <div style={{ fontSize:11, color:G600, marginBottom:6 }}>{pol.address}</div>
                    <div style={{ display:"flex", gap:14, fontSize:10, color:G400 }}>
                      <span>Effective: {pol.effectiveDate}</span>
                      <span>Expires: {pol.expirationDate}</span>
                      <span>{pol.coverages.length} coverages</span>
                      {pol.vehicles.length > 0 && <span>{pol.vehicles.length} vehicle{pol.vehicles.length!==1?"s":""}</span>}
                      {pol.drivers.length > 0 && <span>{pol.drivers.length} driver{pol.drivers.length!==1?"s":""}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ marginTop:18 }}>
                <div style={{ fontSize:11, fontWeight:700, color:G400, marginBottom:8, letterSpacing:1 }}>RECENT ANALYSES</div>
                {history.map(function(h,i) {
                  return (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 12px", background:WHITE, border:"1px solid "+G200, borderRadius:7, marginBottom:5, fontSize:11 }}>
                      <span style={{ color:BLUE, fontFamily:"monospace" }}>{h.pol}</span>
                      <span style={{ color:G600 }}>{h.end}</span>
                      <PremiumChange value={h.impact.proRataIncrease}/>
                      <span style={{ color:G400 }}>pro-rata</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Choose Endorsement */}
        {step === "endorsement" && selectedPol && (
          <div style={{ maxWidth:820 }}>
            <div style={{ background:WHITE, border:"1px solid "+G200, borderRadius:10, padding:"12px 16px", marginBottom:16, display:"flex", gap:14, alignItems:"center" }}>
              <div>
                <div style={{ fontSize:9, color:G400 }}>SELECTED POLICY</div>
                <div style={{ fontSize:13, fontWeight:700, color:BLUE }}>{selectedPol.id} -- {selectedPol.insured}</div>
              </div>
              <div style={{ width:1, height:32, background:G200 }}/>
              <div style={{ fontSize:11, color:G600 }}>{selectedPol.type} -- ${selectedPol.currentPremium.toLocaleString()}/yr current premium</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:BLUE, marginBottom:14 }}>What endorsement does the agent want to make?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10 }}>
              {(ENDORSEMENT_TYPES[selectedPol.type] || []).map(function(end) {
                var key = selectedPol.id + "_" + end.id;
                var hasResult = !!ENDORSEMENT_RESULTS[key];
                return (
                  <div key={end.id} onClick={function() { if(hasResult) selectEndorsement(end); }}
                    style={{ background:WHITE, border:"1.5px solid "+G200, borderRadius:10, padding:"13px 14px", cursor:hasResult?"pointer":"not-allowed", opacity:hasResult?1:0.45, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}
                    onMouseEnter={function(e) { if(hasResult) e.currentTarget.style.borderColor=BLUE; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor=G200; }}>
                    <div style={{ fontSize:22, marginBottom:7 }} dangerouslySetInnerHTML={{ __html:end.icon }}/>
                    <div style={{ fontSize:12, fontWeight:700, color:G800, marginBottom:4 }}>{end.label}</div>
                    <div style={{ fontSize:10, color:G600 }}>{end.desc}</div>
                    {!hasResult && <div style={{ fontSize:9, color:G400, marginTop:5 }}>Demo data not loaded</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Review Request */}
        {step === "form" && selectedPol && selectedEnd && (
          <div style={{ maxWidth:680 }}>
            <div style={{ background:WHITE, border:"1px solid "+G200, borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
              <div style={{ fontSize:9, color:G400 }}>ENDORSEMENT REQUEST</div>
              <div style={{ fontSize:14, fontWeight:700, color:BLUE }}>{selectedEnd.label}</div>
              <div style={{ fontSize:11, color:G600 }}>Policy: {selectedPol.id} -- {selectedPol.insured}</div>
            </div>

            {/* Current policy state */}
            <div style={{ background:WHITE, border:"1px solid "+G200, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:G400, marginBottom:10, letterSpacing:1 }}>CURRENT POLICY STATE</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {selectedPol.coverages.slice(0,6).map(function(cov,i) {
                  return (
                    <div key={i} style={{ padding:"8px 10px", background:G100, borderRadius:7, fontSize:10 }}>
                      <div style={{ color:G400, marginBottom:2 }}>{cov.name}</div>
                      <div style={{ fontWeight:700, color:G800 }}>{cov.limit}</div>
                      <div style={{ color:GREEN }}>${cov.premium}/yr</div>
                    </div>
                  );
                })}
              </div>
              {selectedPol.drivers.length > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:10, color:G400, marginBottom:6 }}>CURRENT DRIVERS</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {selectedPol.drivers.map(function(d,i) {
                      return (
                        <span key={i} style={{ fontSize:10, color:BLUE, background:"#EBF2FF", border:"1px solid "+LBLUE+"44", borderRadius:5, padding:"3px 9px" }}>
                          {d.name} (Age {d.age}) -- {d.mvr}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedPol.vehicles.length > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:10, color:G400, marginBottom:6 }}>CURRENT VEHICLES</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {selectedPol.vehicles.map(function(v,i) {
                      return (
                        <span key={i} style={{ fontSize:10, color:PURPLE, background:"#F0EBFF", border:"1px solid "+PURPLE+"44", borderRadius:5, padding:"3px 9px" }}>
                          {v.year} {v.make} {v.model}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pre-loaded request info */}
            {(function() {
              var key = selectedPol.id + "_" + selectedEnd.id;
              var res = ENDORSEMENT_RESULTS[key];
              if (!res) return null;
              return (
                <div style={{ background:"#EBF2FF", border:"1px solid "+LBLUE+"55", borderRadius:10, padding:"13px 15px", marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:BLUE, marginBottom:5 }}>ENDORSEMENT REQUEST DETAILS</div>
                  <div style={{ fontSize:12, fontWeight:700, color:G800 }}>{res.endorsementTitle}</div>
                  <div style={{ fontSize:10, color:G600, marginTop:4 }}>AI will calculate premium impact, coverage gaps, and new exposures for this change.</div>
                </div>
              );
            })()}

            <button onClick={runAnalysis}
              style={{ width:"100%", padding:"12px", background:BLUE, border:"none", borderRadius:10, color:WHITE, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Run AI Impact Analysis
            </button>
          </div>
        )}

        {/* STEP 4: Loading */}
        {step === "result" && loading && (
          <div style={{ maxWidth:700 }}>
            <div style={{ background:WHITE, borderRadius:12, padding:"22px 20px", border:"1px solid "+G200, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:13, color:BLUE, fontWeight:700, marginBottom:18 }}>Analysing endorsement impact...</div>
              {PHASES.map(function(label, i) {
                var done = i < phaseIdx;
                var act  = i === phaseIdx;
                var pct  = [20,40,60,80,100][i];
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:act?BLUE:done?GREEN:G400, fontWeight:act?700:400 }}>
                        {done?"v ":act?"> ":"o "}{label}
                      </span>
                      <span style={{ fontSize:10, color:G400 }}>{done||act?pct:0}%</span>
                    </div>
                    <div style={{ height:4, background:G200, borderRadius:4 }}>
                      <div style={{ height:"100%", width:(done||act)?pct+"%":"0%", background:done?GREEN:act?BLUE:"transparent", borderRadius:4, transition:"width 0.5s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === "result" && !loading && result && (
          <div style={{ maxWidth:900 }}>

            {/* Result header */}
            <div style={{ background:WHITE, border:"1px solid "+G200, borderRadius:10, padding:"12px 16px", marginBottom:12 }}>
              <div style={{ fontSize:9, color:G400 }}>ENDORSEMENT ANALYSED</div>
              <div style={{ fontSize:14, fontWeight:700, color:G800 }}>{result.endorsementTitle}</div>
              <div style={{ fontSize:11, color:G600 }}>Policy: {selectedPol.id} -- {selectedPol.insured} -- {selectedPol.type}</div>
            </div>

            {/* Impact banner */}
            {(function() {
              var imp = result.premiumImpact;
              var dir = imp.direction === "INCREASE";
              var c   = dir ? RED : GREEN;
              return (
                <div style={{ marginBottom:14, padding:"14px 18px", background:WHITE, border:"2px solid "+c, borderRadius:12, display:"flex", gap:18, flexWrap:"wrap", alignItems:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ textAlign:"center", minWidth:80 }}>
                    <div style={{ fontSize:9, color:G400, marginBottom:3 }}>PRO-RATA IMPACT</div>
                    <div style={{ fontSize:28, fontWeight:800, color:c, lineHeight:1 }}>
                      {dir?"+":"-"}${Math.abs(imp.proRataIncrease).toLocaleString()}
                    </div>
                    <div style={{ fontSize:9, color:G400 }}>due now</div>
                  </div>
                  <div style={{ width:1, height:52, background:G200 }}/>
                  <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                    {[
                      { l:"Annual Change",       v:(dir?"+":"-")+"$"+Math.abs(imp.annualIncrease).toLocaleString(), c:c     },
                      { l:"New Annual Premium",  v:"$"+imp.newAnnualPremium.toLocaleString(),                       c:BLUE  },
                      { l:"% Change",            v:(dir?"+":"")+imp.percentageChange+"%",                           c:c     },
                      { l:"Coverage Gaps Found", v:gapCount,                                                        c:AMBER },
                      { l:"Critical Issues",     v:critCount,                                                       c:critCount>0?ORANGE:GREEN },
                    ].map(function(m) {
                      return (
                        <div key={m.l} style={{ textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:700, color:m.c }}>{m.v}</div>
                          <div style={{ fontSize:9, color:G400, marginTop:2 }}>{m.l}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Critical alert if any */}
            {critCount > 0 && (
              <div style={{ marginBottom:12, padding:"11px 14px", background:"#FFF0EB", border:"2px solid "+ORANGE, borderRadius:9, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16, flexShrink:0, color:ORANGE }}>&#9888;</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:ORANGE }}>
                    {critCount} CRITICAL issue{critCount!==1?"s":""} detected -- agent action required before binding
                  </div>
                  <div style={{ fontSize:11, color:G800, marginTop:3 }}>
                    Review the Coverage Gaps and New Exposures tabs. Document customer acknowledgment before processing this endorsement.
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display:"flex", marginBottom:14, borderBottom:"2px solid "+G200, flexWrap:"wrap" }}>
              {[
                { k:"premium",    l:"Premium Breakdown" },
                { k:"gaps",       l:"Coverage Gaps ("+gapCount+")" },
                { k:"exposures",  l:"New Exposures ("+expCount+")" },
                { k:"uw",         l:"UW Flags ("+result.uwFlags.length+")" },
                { k:"compliance", l:"Compliance ("+result.complianceNotes.length+")" },
              ].map(function(tab) {
                var a = activeTab === tab.k;
                return (
                  <button key={tab.k} onClick={function() { setActiveTab(tab.k); }}
                    style={{ background:"transparent", border:"none", borderBottom:"3px solid "+(a?BLUE:"transparent"), color:a?BLUE:G600, padding:"7px 13px", fontSize:11, fontWeight:a?700:400, cursor:"pointer", marginBottom:-2 }}>
                    {tab.l}
                  </button>
                );
              })}
            </div>

            {activeTab === "premium" && (
              <div>
                <div style={{ fontSize:11, color:G600, marginBottom:10 }}>Breakdown of premium change by coverage line:</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {result.premiumImpact.breakdown.map(function(b, i) {
                    var c = b.change > 0 ? RED : b.change < 0 ? GREEN : G400;
                    var pct = Math.abs(b.change) / Math.max(1, result.premiumImpact.annualIncrease) * 100;
                    return (
                      <div key={i} style={{ background:WHITE, borderRadius:9, padding:"12px 14px", border:"1px solid "+G200 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:G800 }}>{b.item}</div>
                          <PremiumChange value={b.change} size={13}/>
                        </div>
                        <div style={{ height:5, background:G200, borderRadius:3, marginBottom:5 }}>
                          <div style={{ height:"100%", width:Math.min(pct,100)+"%", background:c, borderRadius:3 }}/>
                        </div>
                        <div style={{ fontSize:10, color:G600 }}>{b.reason}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop:10, padding:"11px 14px", background:"#EBF2FF", border:"1px solid "+LBLUE+"55", borderRadius:9 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:BLUE }}>Pro-rata adjustment due at endorsement effective date:</span>
                    <PremiumChange value={result.premiumImpact.proRataIncrease} size={14}/>
                  </div>
                  <div style={{ fontSize:10, color:G600, marginTop:3 }}>
                    Based on {selectedPol.proRataDays} days remaining in policy term.
                    Annual change: ${result.premiumImpact.annualIncrease.toLocaleString()} -- New full-term premium: ${result.premiumImpact.newAnnualPremium.toLocaleString()}/yr
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gaps" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.coverageGaps.map(function(g, i) {
                  var st = SEV_THEME[g.severity] || SEV_THEME.LOW;
                  return (
                    <div key={i} style={{ background:WHITE, borderRadius:9, padding:"13px 15px", border:"1px solid "+G200, borderLeft:"4px solid "+st.border }}>
                      <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                        <SevBadge severity={g.severity}/>
                        <span style={{ fontSize:9, color:G600, border:"1px solid "+G200, borderRadius:3, padding:"0 5px" }}>{g.type}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:G800, marginBottom:5 }}>{g.title}</div>
                      <div style={{ fontSize:11, color:G600, lineHeight:1.75 }}>{g.detail}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "exposures" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.newExposures.map(function(e, i) {
                  var st = SEV_THEME[e.severity] || SEV_THEME.LOW;
                  return (
                    <div key={i} style={{ background:WHITE, borderRadius:9, padding:"13px 15px", border:"1px solid "+G200, borderLeft:"4px solid "+st.border }}>
                      <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                        <SevBadge severity={e.severity}/>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:G800, marginBottom:5 }}>{e.exposure}</div>
                      <div style={{ fontSize:11, color:G600, lineHeight:1.75 }}>{e.detail}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "uw" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.uwFlags.map(function(f, i) {
                  return (
                    <div key={i} style={{ background:"#FFF8EC", borderRadius:9, padding:"12px 14px", border:"1px solid "+AMBER, display:"flex", gap:10 }}>
                      <span style={{ fontSize:14, color:AMBER, flexShrink:0 }}>&#9888;</span>
                      <div style={{ fontSize:11, color:G800, lineHeight:1.7 }}>{f}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "compliance" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.complianceNotes.map(function(n, i) {
                  return (
                    <div key={i} style={{ background:G100, borderRadius:9, padding:"12px 14px", border:"1px solid "+G200, display:"flex", gap:10 }}>
                      <span style={{ fontSize:14, color:BLUE, flexShrink:0 }}>&#128205;</span>
                      <div style={{ fontSize:11, color:G800, lineHeight:1.7 }}>{n}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop:16, display:"flex", gap:10 }}>
              <button onClick={function() { setStep("endorsement"); setResult(null); }}
                style={{ padding:"9px 20px", background:G100, border:"1px solid "+G200, borderRadius:8, color:G800, fontSize:12, cursor:"pointer" }}>
                Try Another Endorsement
              </button>
              <button onClick={reset}
                style={{ padding:"9px 20px", background:BLUE, border:"none", borderRadius:8, color:WHITE, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Analyse a Different Policy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background:WHITE, borderTop:"1px solid "+G200, padding:"6px 24px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:GREEN }}/>
          <span style={{ fontSize:10, color:GREEN, fontWeight:700 }}>PoC -- Static Data</span>
        </div>
        {["PolicyCenter","Personal Auto","HO-3 Homeowners","Commercial Auto","Claude Sonnet (Prod)","Rating Engine (Prod)"].map(function(t) {
          return <span key={t} style={{ fontSize:9, color:G600, border:"1px solid "+G200, padding:"2px 7px", borderRadius:3, background:G100 }}>{t}</span>;
        })}
        <span style={{ marginLeft:"auto", fontSize:10, color:G400 }}>NTT DATA -- Endorsement Impact Analyser 2025</span>
      </div>
    </div>
  );
}
