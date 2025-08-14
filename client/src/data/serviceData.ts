export interface ServiceSectionData {
    id: string;
    title: string;
    description: string;
  }
  
  export interface ServiceDataMap {
    [key: string]: {
      sections: ServiceSectionData[];
    };
  }
  
  export const serviceData: ServiceDataMap = {
    Transport: {
      sections: [
        {
          id: "new-drivers",
          title: "New Driver's License",
          description: "Learn how to register, get a license, or update your details for driving.",
        },
        {
          id: "vehicle-related",
          title: "Vehicle-Related Services",
          description: "Services related to vehicle registration, ownership, and documentation.",
        },
        {
          id: "driving-license",
          title: "Driving License Services",
          description: "Renew, replace, or update your driving license details.",
        },
        {
          id: "appointment-online",
          title: "Appointment & Online Services",
          description: "Book appointments and access online service portals for driving-related tasks.",
        },
      ],
    },
    "Health Services": {
      sections: [
        {
          id: "medical-records",
          title: "Medical Records",
          description: "Access and manage your medical records and health information.",
        },
        {
          id: "appointments",
          title: "Medical Appointments",
          description: "Schedule and manage medical appointments with healthcare providers.",
        },
        {
          id: "health-cards",
          title: "Health Insurance Cards",
          description: "Apply for or renew your health insurance cards and coverage.",
        },
      ],
    },
  };
  