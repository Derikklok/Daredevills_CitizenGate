import { useState, useEffect } from "react";
import ServiceAdminLayout from "./components/ServiceAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";

const ServiceSettings = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifyOnNewAppointment: true,
    notifyOnAppointmentCancellation: true,
    notifyOnDocumentUpload: true,
    allowSameDayBookings: false,
    maxDaysInAdvance: 30,
    requireDocumentApproval: true,
    departmentName: "",
    departmentEmail: "",
    departmentPhone: ""
  });

  useEffect(() => {
    // In a real application, you would fetch settings from your API
    const fetchSettings = async () => {
      try {
        // Mock data for demonstration
        setSettings({
          notifyOnNewAppointment: true,
          notifyOnAppointmentCancellation: true,
          notifyOnDocumentUpload: true,
          allowSameDayBookings: false,
          maxDaysInAdvance: 30,
          requireDocumentApproval: true,
          departmentName: user?.publicMetadata?.departmentName as string || "Passport Department",
          departmentEmail: "passport@gov.example",
          departmentPhone: "+1234567890"
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // In a real application, you would save these settings to your API
    console.log("Saving settings:", settings);
    // Show success message
    alert("Settings saved successfully!");
  };

  if (loading) {
    return (
      <ServiceAdminLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading settings...</p>
          </div>
        </div>
      </ServiceAdminLayout>
    );
  }

  return (
    <ServiceAdminLayout>
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Service Settings</h1>
          <p className="text-gray-600">Configure settings for your department's services</p>
        </header>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="departmentInfo">Department Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyNewAppointment" className="font-medium">
                      New Appointment Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications when a new appointment is booked
                    </p>
                  </div>
                  <Switch
                    id="notifyNewAppointment"
                    checked={settings.notifyOnNewAppointment}
                    onCheckedChange={(checked: boolean) => handleSettingChange("notifyOnNewAppointment", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyCancellation" className="font-medium">
                      Cancellation Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications when an appointment is cancelled
                    </p>
                  </div>
                  <Switch
                    id="notifyCancellation"
                    checked={settings.notifyOnAppointmentCancellation}
                    onCheckedChange={(checked: boolean) => handleSettingChange("notifyOnAppointmentCancellation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyDocuments" className="font-medium">
                      Document Upload Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications when documents are uploaded
                    </p>
                  </div>
                  <Switch
                    id="notifyDocuments"
                    checked={settings.notifyOnDocumentUpload}
                    onCheckedChange={(checked: boolean) => handleSettingChange("notifyOnDocumentUpload", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sameDayBooking" className="font-medium">
                      Allow Same-Day Bookings
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow citizens to book appointments for the same day
                    </p>
                  </div>
                  <Switch
                    id="sameDayBooking"
                    checked={settings.allowSameDayBookings}
                    onCheckedChange={(checked: boolean) => handleSettingChange("allowSameDayBookings", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDaysAdvance" className="font-medium">
                    Maximum Days in Advance
                  </Label>
                  <p className="text-sm text-gray-500">
                    How many days in advance citizens can book appointments
                  </p>
                  <Input
                    id="maxDaysAdvance"
                    type="number"
                    value={settings.maxDaysInAdvance}
                    onChange={(e) => handleSettingChange("maxDaysInAdvance", parseInt(e.target.value))}
                    className="max-w-xs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireApproval" className="font-medium">
                      Require Document Approval
                    </Label>
                    <p className="text-sm text-gray-500">
                      Require manual approval of uploaded documents before appointment
                    </p>
                  </div>
                  <Switch
                    id="requireApproval"
                    checked={settings.requireDocumentApproval}
                    onCheckedChange={(checked: boolean) => handleSettingChange("requireDocumentApproval", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departmentInfo">
            <Card>
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="departmentName" className="font-medium">
                    Department Name
                  </Label>
                  <Input
                    id="departmentName"
                    value={settings.departmentName}
                    onChange={(e) => handleSettingChange("departmentName", e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentEmail" className="font-medium">
                    Department Email
                  </Label>
                  <Input
                    id="departmentEmail"
                    type="email"
                    value={settings.departmentEmail}
                    onChange={(e) => handleSettingChange("departmentEmail", e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentPhone" className="font-medium">
                    Department Phone
                  </Label>
                  <Input
                    id="departmentPhone"
                    value={settings.departmentPhone}
                    onChange={(e) => handleSettingChange("departmentPhone", e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">Save Changes</Button>
        </div>
      </div>
    </ServiceAdminLayout>
  );
};

export default ServiceSettings;
