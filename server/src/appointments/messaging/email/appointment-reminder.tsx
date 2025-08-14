import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface AppointmentReminderEmailProps {
  appointmentId: string;
  appointmentTime: string;
  serviceName: string;
  departmentName: string;
  location?: string;
  userName: string;
  userEmail: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
}

export const AppointmentReminderEmail: React.FC<
  AppointmentReminderEmailProps
> = ({
  appointmentId,
  appointmentTime,
  serviceName,
  departmentName,
  location,
  userName,
  userEmail,
  cancelUrl,
  rescheduleUrl,
}) => {
  const formattedDate = new Date(appointmentTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(appointmentTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Html>
      <Head>
        <title>Appointment Reminder - CitizenGate</title>
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>
              <span style={{ color: "#8D153A" }}>Citizen</span>
              <span>Gate</span>
            </Heading>
            <Text style={tagline}>Your Gateway to Government Services</Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Appointment Reminder</Heading>

            <Text style={text}>Dear {userName},</Text>

            <Text style={text}>
              This is a friendly reminder about your upcoming appointment with{" "}
              {departmentName}.
            </Text>

            {/* Appointment Details Card */}
            <Section style={card}>
              <Heading style={h2}>Appointment Details</Heading>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={labelText}>Service:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{serviceName}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={labelText}>Date:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{formattedDate}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={labelText}>Time:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{formattedTime}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={labelText}>Department:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{departmentName}</Text>
                </Column>
              </Row>

              {location && (
                <Row style={detailRow}>
                  <Column style={detailLabel}>
                    <Text style={labelText}>Location:</Text>
                  </Column>
                  <Column style={detailValue}>
                    <Text style={valueText}>{location}</Text>
                  </Column>
                </Row>
              )}

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={labelText}>Appointment ID:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{appointmentId}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              Please arrive 10 minutes before your scheduled time to complete
              any necessary check-in procedures.
            </Text>

            <Text style={text}>
              If you need to bring any documents, please ensure you have them
              ready for your appointment.
            </Text>

            {/* Action Buttons */}
            <Section style={buttonContainer}>
              {rescheduleUrl && (
                <Button style={secondaryButton} href={rescheduleUrl}>
                  Reschedule Appointment
                </Button>
              )}

              {cancelUrl && (
                <Button style={dangerButton} href={cancelUrl}>
                  Cancel Appointment
                </Button>
              )}
            </Section>

            <Text style={text}>
              If you have any questions or need to make changes to your
              appointment, please contact us as soon as possible.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated reminder from CitizenGate. Please do not
              reply to this email.
            </Text>
            <Text style={footerText}>
              For support, please visit our website or contact our support team.
            </Text>
            <Text style={footerText}>
              © 2024 CitizenGate. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1a202c",
  margin: "0",
};

const tagline = {
  fontSize: "16px",
  color: "#718096",
  margin: "8px 0 0 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
};

const content = {
  padding: "0 40px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a202c",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
};

const h2 = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a202c",
  margin: "0 0 16px 0",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4a5568",
  margin: "0 0 16px 0",
};

const card = {
  backgroundColor: "#f7fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const detailRow = {
  margin: "0 0 12px 0",
};

const detailLabel = {
  width: "30%",
  verticalAlign: "top" as const,
};

const detailValue = {
  width: "70%",
  verticalAlign: "top" as const,
};

const labelText = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4a5568",
  margin: "0",
};

const valueText = {
  fontSize: "14px",
  color: "#2d3748",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const secondaryButton = {
  backgroundColor: "#4299e1",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 8px",
};

const dangerButton = {
  backgroundColor: "#e53e3e",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 8px",
};

const footer = {
  textAlign: "center" as const,
  padding: "20px 40px",
};

const footerText = {
  fontSize: "12px",
  color: "#718096",
  margin: "4px 0",
};

export default AppointmentReminderEmail;
