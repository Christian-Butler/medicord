import { MaterialIcons } from "@expo/vector-icons";

export type MedicalRecordsCategory =
    | "family_medical_history"
    | "personal_medical_history"
    | "allergies"
    | "vaccines"
    | "operations"
    | "treatments";

export interface CategoryConfig {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    items: string[];
}

export const categories: Record<MedicalRecordsCategory, CategoryConfig> = {
    family_medical_history: {
        title: "Family Medical History",
        icon: "medical-information",
        items: [
            "Anxiety disorder",
            "Asthma",
            "Breast Cancer",
            "Colorectal cancer",
            "Coronary artery disease",
            "Depressive disorder",
            "Diabetes",
            "Heart failure",
            "High blood pressure",
            "Hypercholesterolemia",
            "Hyperthyroidism",
            "Hypothyroidism",
            "Lung cancer",
            "Obesity",
            "Stroke",
        ],
    },
    personal_medical_history: {
        title: "Personal Medical History",
        icon: "medical-information",
        items: [
            "Anxiety disorder",
            "Asthma",
            "Breast Cancer",
            "Colorectal cancer",
            "Coronary artery disease",
            "Depressive disorder",
            "Diabetes",
            "Heart failure",
            "High blood pressure",
            "Hypercholesterolemia",
            "Hyperthyroidism",
            "Hypothyroidism",
            "Lung cancer",
            "Obesity",
            "Stroke",
        ],
    },
    allergies: {
        title: "Allergies",
        icon: "gpp-maybe",
        items: [
            "Dust Mites",
            "Iodinated contrast agents (x-rays)",
            "Latex",
            "Local anaesthetics",
            "Milk",
            "Non-steroidal anti-inflammatory drugs",
            "Nuts",
            "Penicillins",
            "Peanuts",
            "Pollen",
            "Sea food",
            "Shellfish",
            "Soy",
            "Sulfonamides"
        ],
    },
    vaccines: {
        title: "Vaccines",
        icon: "vaccines",
        items: [
            "COVID-19",
            "Diptheria",
            "Hepatitis B",
            "Influenza (Flu)",
            "MMR",
            "Polio",
            "Tetanus",
        ],
    },
    operations: {
        title: "Surgical Operations",
        icon: "local-hospital",
        items: [
            "Adenoidectomy",
            "Appendectomy",
            "Caesarean Section",
            "Cataract Surgery",
            "Cholecystectomy",
            "Gallbladder Removal",
            "Hernia Repair",
            "Hip replacement",
            "Knee Replacement",
            "Tonsillectomy",
            "Stent delivery",
            "Vaginal caesarean",
            "Wisdom tooth removal",
        ],
    },
    treatments: {
        title: "Treatments",
        icon: "medication",
        items: [],
    },
};