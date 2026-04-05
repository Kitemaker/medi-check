/**
 * OpenFDA Drug Information — real public API, no auth needed.
 * https://api.fda.gov/drug/label.json
 */

export interface DrugInfo {
  name: string;
  genericName?: string;
  purpose?: string;
  warnings?: string;
  dosageAndAdministration?: string;
  adverseReactions?: string;
  drugInteractions?: string;
}

export async function lookupDrug(drugName: string): Promise<DrugInfo | null> {
  try {
    const query = encodeURIComponent(`openfda.brand_name:"${drugName}"+OR+openfda.generic_name:"${drugName}"`);
    const res = await fetch(
      `https://api.fda.gov/drug/label.json?search=${query}&limit=1`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return getFallbackDrugInfo(drugName);

    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return getFallbackDrugInfo(drugName);

    return {
      name: result.openfda?.brand_name?.[0] ?? drugName,
      genericName: result.openfda?.generic_name?.[0],
      purpose: result.purpose?.[0]?.slice(0, 300),
      warnings: result.warnings?.[0]?.slice(0, 400),
      dosageAndAdministration: result.dosage_and_administration?.[0]?.slice(0, 300),
      adverseReactions: result.adverse_reactions?.[0]?.slice(0, 300),
      drugInteractions: result.drug_interactions?.[0]?.slice(0, 300),
    };
  } catch {
    return getFallbackDrugInfo(drugName);
  }
}

function getFallbackDrugInfo(drugName: string): DrugInfo {
  const fallbacks: Record<string, DrugInfo> = {
    metformin: {
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      purpose: 'Controls blood sugar levels in type 2 diabetes. Works by decreasing glucose production in the liver and improving insulin sensitivity.',
      warnings: 'Risk of lactic acidosis. Do not use if kidney function is severely impaired. Temporarily stop before contrast imaging procedures.',
      dosageAndAdministration: 'Take with meals to reduce GI side effects. Start low, titrate slowly. Typical dose: 500–2000mg/day.',
      adverseReactions: 'Nausea, diarrhea, stomach upset (usually temporary). Rarely: lactic acidosis, B12 deficiency with long-term use.',
      drugInteractions: 'Contrast dye (iodinated), alcohol (increases lactic acidosis risk), carbonic anhydrase inhibitors.',
    },
    lisinopril: {
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      purpose: 'ACE inhibitor used to treat hypertension (high blood pressure) and heart failure. Also protects kidneys in diabetes.',
      warnings: 'Can cause angioedema (swelling of face/throat) — stop immediately if this occurs. Do not use during pregnancy. Monitor potassium and kidney function.',
      dosageAndAdministration: 'Take once daily. Typical doses: 5–40mg for hypertension. Can take with or without food.',
      adverseReactions: 'Dry persistent cough (very common), dizziness, headache, elevated potassium, worsening kidney function.',
      drugInteractions: 'NSAIDs (reduce effectiveness, worsen kidneys), potassium supplements, other ACE inhibitors, ARBs.',
    },
  };

  const key = drugName.toLowerCase().split(' ')[0];
  return fallbacks[key] ?? {
    name: drugName,
    purpose: 'Information not available. Please consult your pharmacist or physician for detailed medication information.',
  };
}
