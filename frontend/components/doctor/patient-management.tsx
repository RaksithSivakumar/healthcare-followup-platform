"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Calendar,
  Heart,
  Activity,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  User,
  Mail,
  FileText,
  Stethoscope,
  Pill,
  Thermometer,
  Eye,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import { AddPatientForm } from "./add-patients";

// Patient interface based on the exact schema structure
interface Patient {
  id: string;
  pid: string;
  pname: string;
  pemail: string;
  ppassword: string;
  doctor: {
    did: string;
    dname: string;
    demail: string;
    dpassword: string;
  };
  visits: Array<{
    visit_date: string;
    condition: string;
    disease: string;
    vital: {
      bp: string;
      hr: string;
      spo2: string;
    };
    symptoms: Array<{
      name: string;
      pain_level: string;
      notes: string;
    }>;
    medications: Array<{
      medication: string;
      dosage: string;
      duration: string;
      route: string;
      notes: string;
    }>;
    report: string;
  }>;
  symptomLogs: Array<{
    symptoms: Array<{
      symptomName: string;
      intensity: string;
      notes: string;
    }>;
    timestamp: string;
    returnVisit: string;
    visitDate: string;
  }>;
  // Additional display fields for UI
  condition: string;
  status: string;
  lastContact: string;
  riskLevel: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    spo2: number;
  };
  medications: string[];
  symptoms: string[];
  notes: string;
  visitCount: number;
  lastVisitDate: string | null;
}

export function PatientManagement() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch patients from backend
  const fetchPatients = async () => {
    if (!user || user.role !== "doctor") {
      setError("Only doctors can access patient management");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/patients/doctor-patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch patients");
      }

      if (result.success) {
        setPatients(result.patients);
      } else {
        throw new Error(result.error || "Failed to fetch patients");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching patients");
      console.error("Fetch patients error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [user]);

  // Handle new patient added
  const handlePatientAdded = (newPatient: any) => {
    setPatients((prev) => [...prev, newPatient]);
    setIsAddDialogOpen(false);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.pid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats for the header
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(
    (p) => p.status === "critical"
  ).length;
  const stablePatients = patients.filter((p) => p.status === "stable").length;

  if (!user || user.role !== "doctor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-indigo-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border-0 dark:border dark:border-gray-800 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Only doctors can access patient management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header Section with Glass Morphism */}
        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-gray-800/60">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Patient Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Manage{" "}
                    <span className="font-semibold text-blue-600">
                      {totalPatients}
                    </span>{" "}
                    patients, including{" "}
                    <span className="font-semibold text-red-500">
                      {criticalPatients}
                    </span>{" "}
                    critical cases
                  </p>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                    Total: {totalPatients}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-200">
                    Stable: {stablePatients}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-200">
                    Critical: {criticalPatients}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 lg:mt-0">
              <Button
                onClick={fetchPatients}
                disabled={loading}
                className="bg-blue-900 hover:bg-blue-900/65"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
                  <AddPatientForm
                    onPatientAdded={handlePatientAdded}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-2xl shadow-xl animate-pulse">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/60 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800/60">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Patient Directory
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {loading
                    ? "Loading patients..."
                    : `Showing ${filteredPatients.length} of ${patients.length} patients`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search patients by name, condition, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="attention">Attention</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {patients.length === 0
                    ? "No patients found"
                    : "No matching patients"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {patients.length === 0
                    ? "Start by adding your first patient!"
                    : "Try adjusting your search or filter criteria."}
                </p>
                {patients.length === 0 && (
                  <Button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Patient
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="group bg-white dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    {/* Patient Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-lg">
                            <AvatarImage
                              src="/patient-avatar.png"
                              alt={patient.pname}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40">
                              <User className="h-5 w-5 text-blue-600" />
                            </AvatarFallback>
                          </Avatar>
                          {patient.status === "critical" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-ping"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                            {patient.pname}
                          </h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {patient.pid}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        className={`
                        rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          patient.riskLevel === "high"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : patient.riskLevel === "medium"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        }
                      `}
                      >
                        {patient.riskLevel} risk
                      </Badge>
                      <Badge
                        className={`
                        rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          patient.status === "critical"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : patient.status === "attention"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        }
                      `}
                      >
                        {patient.status}
                      </Badge>
                    </div>

                    {/* Patient Info */}
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{patient.pemail}</span>
                      </p>
                      <p>{patient.condition}</p>
                      <p className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        Last contact: {patient.lastContact}
                      </p>
                    </div>

                    {/* Vitals */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{patient.vitals.heartRate} BPM</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Thermometer className="h-3 w-3 text-blue-500" />
                          <span>{patient.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3 text-green-500" />
                          <span>{patient.vitals.spo2}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Visits: {patient.visitCount}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patient Details Dialog */}
        {selectedPatient && (
          <Dialog
            open={!!selectedPatient}
            onOpenChange={() => setSelectedPatient(null)}
          >
            <DialogContent className="max-w-4xl w-[95vw] h-[95vh] rounded-2xl border-0 bg-white dark:bg-gray-950 shadow-2xl p-0 overflow-hidden">
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6">
                <DialogHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-white/20">
                          <AvatarImage
                            src="/patient-avatar.png"
                            alt={selectedPatient.pname}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-white/10 text-white">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-700 ${
                            selectedPatient.status === "critical"
                              ? "bg-red-400"
                              : "bg-green-400"
                          }`}
                        />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-white mb-1">
                          {selectedPatient.pname}
                        </DialogTitle>
                        <div className="text-white/80 text-sm space-y-1">
                          <div>Patient ID: {selectedPatient.pid}</div>
                          <div className="text-white/60">
                            {selectedPatient.condition}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          selectedPatient.riskLevel === "high"
                            ? "bg-red-500/20 text-red-200 border border-red-400/30"
                            : "bg-green-500/20 text-green-200 border border-green-400/30"
                        }`}
                      >
                        {selectedPatient.riskLevel.toUpperCase()} RISK
                      </div>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          selectedPatient.status === "critical"
                            ? "text-red-300"
                            : "text-blue-300"
                        }`}
                      >
                        {selectedPatient.status.toUpperCase()} STATUS
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Scrollable Content Area */}
              <div className="h-[calc(95vh-200px)] overflow-y-auto px-6 py-4 bg-white dark:bg-gray-950">
                {/* Vital Signs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      icon: <Heart className="h-4 w-4 text-rose-500" />,
                      label: "Heart Rate",
                      value: selectedPatient.vitals?.heartRate || "N/A",
                      unit: "BPM",
                      trend: "stable",
                    },
                    {
                      icon: <Thermometer className="h-4 w-4 text-blue-500" />,
                      label: "Blood Pressure",
                      value: selectedPatient.vitals?.bloodPressure || "N/A",
                      unit: "",
                      trend: "up",
                    },
                    {
                      icon: <Activity className="h-4 w-4 text-emerald-500" />,
                      label: "O₂ Saturation",
                      value: selectedPatient.vitals?.spo2 || "N/A",
                      unit: "%",
                      trend: "stable",
                    },
                    {
                      icon: <Calendar className="h-4 w-4 text-amber-500" />,
                      label: "Total Visits",
                      value: selectedPatient.visitCount || 0,
                      unit: "",
                      trend: "up",
                    },
                  ].map((vital, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-3 text-center hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-center mb-2 opacity-70">
                        {vital.icon}
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">
                        {vital.value}
                        {vital.unit}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400 font-medium truncate">
                        {vital.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Patient Information Sections */}
                <div className="space-y-4">
                  {/* Contact & Status */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3 flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-slate-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Email</span>
                          <span className="font-medium text-slate-900 dark:text-gray-100 truncate max-w-[150px]">
                            {selectedPatient.pemail || "Not provided"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Last Contact</span>
                          <span className="font-medium text-slate-900 dark:text-gray-100">
                            {selectedPatient.lastContact || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Condition</span>
                          <span className="font-medium text-slate-900 dark:text-gray-100 truncate max-w-[150px]">
                            {selectedPatient.condition}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Summary */}
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3 flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-2 text-slate-500" />
                        Medical Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Status</span>
                          <span
                            className={`font-semibold ${
                              selectedPatient.status === "critical"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {selectedPatient.status?.toUpperCase() || "STABLE"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Risk Level</span>
                          <span
                            className={`font-semibold ${
                              selectedPatient.riskLevel === "high"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {selectedPatient.riskLevel?.toUpperCase() || "LOW"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-gray-400">Last Update</span>
                          <span className="font-medium text-slate-900 dark:text-gray-100">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medications & Symptoms */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Medications */}
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3 flex items-center text-sm">
                        <Pill className="h-4 w-4 mr-2 text-slate-500" />
                        Medications{" "}
                        {selectedPatient.medications?.length > 0 &&
                          `(${selectedPatient.medications.length})`}
                      </h3>
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {selectedPatient.medications?.length > 0 ? (
                          selectedPatient.medications.map((med, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {med}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 dark:text-gray-500 text-sm">
                            No medications listed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3 flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-2 text-slate-500" />
                        Symptoms{" "}
                        {selectedPatient.symptoms?.length > 0 &&
                          `(${selectedPatient.symptoms.length})`}
                      </h3>
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {selectedPatient.symptoms?.length > 0 ? (
                          selectedPatient.symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                            >
                              {symptom}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 dark:text-gray-500 text-sm">
                            No symptoms reported
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes Section */}
                  <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3 flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-slate-500" />
                      Clinical Notes
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-gray-800 rounded p-3 min-h-[60px]">
                      {selectedPatient.notes ||
                        "No additional notes available for this patient."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 px-6 mb-6">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPatient(null)}
                      className="rounded-lg border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 text-sm h-9"
                    >
                      Close
                    </Button>
                    <Button className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm h-9 shadow-sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit Record
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
