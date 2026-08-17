import { MaterialIcons } from "@expo/vector-icons";

export type MedicalRecordsCategory =
    | "medical_history"
    | "treatments"
    | "allergies"
    | "vaccines"
    | "operations";

export interface CategoryConfig {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    items: string[];
}

export const categories: Record<MedicalRecordsCategory, CategoryConfig> = {
    medical_history: {
        title: "Medical History",
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
    treatments: {
        title: "Treatments",
        icon: "medication",
        items: [
        ],
    },
    allergies: {
        title: "Allergies",
        icon: "warning",
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