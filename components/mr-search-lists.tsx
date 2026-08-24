import { MaterialIcons } from "@expo/vector-icons";

export type MedicalRecordsCategory =
    | "family_medical_history"
    | "personal_medical_history"
    | "allergies"
    | "vaccines"
    | "operations";

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
            "Asthma",
            "Coronary artery disease",
            "Diabetes",
            "Heart failure",
            "High blood pressure",
            "Hypercholesterolemia",
            "Stroke",
        ],
    },
    personal_medical_history: {
        title: "Personal Medical History",
        icon: "medical-information",
        items: [
            "Asthma",
            "Coronary artery disease",
            "Diabetes",
            "Heart failure",
            "High blood pressure",
            "Hypercholesterolemia",
            "Stroke",
        ],
    },
    allergies: {
        title: "Allergies",
        icon: "gpp-maybe",
        items: [
            "Dust Mites",
            "Latex",
            "Local anaesthetics",
            "Penicillin",
            "Peanuts",
            "Pollen",
            "Shellfish",
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
            "Appendectomy",
            "Caesarean Section",
            "Cataract Surgery",
            "Gallbladder Removal",
            "Hernia Repair",
            "Knee Replacement",
            "Wisdom tooth removal",
        ],
    },
};