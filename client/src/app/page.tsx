"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, TrendingUp, Calculator, Star, BarChart3 } from "lucide-react";

interface PredictionResult {
  input: {
    StudyHours: number;
    Attendance_rate: number;
    Previous_grade: number;
    Online_classes: number;
  };
  model: string;
  predicted_final_grade: number;
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    StudyHours: "",
    Attendance_rate: "3",
    Previous_grade: "2",
    Online_classes: "1",
    selectedPredictor: "Predictor 2",
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getModelParam = () => {
    switch (formData.selectedPredictor) {
      case "predictor-1":
        return "lr";
      case "Predictor 2":
        return "rf";
      default:
        return "rf";
    }
  };

  const getPrimaryPrediction = () => {
    if (prediction?.predicted_final_grade == null) return "N/A";
    return prediction.predicted_final_grade.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

  const getPredictorLabel = () => {
    switch (formData.selectedPredictor) {
      case "predictor-1":
        return "Predictor-1";
      case "Predictor 2":
        return "Predictor 2";
      default:
        return "Predictor 2";
    }
  };

  const handlePredict = async () => {
    if (!formData.StudyHours) {
      setError("Please enter Study Hours");
      return;
    }
    if (!formData.Attendance_rate) {
      setError("Please enter Attendance Rate");
      return;
    }
    if (!formData.Previous_grade) {
      setError("Please enter Previous Grade");
      return;
    }
    if (!formData.Online_classes) {
      setError("Please enter Online Classes");
      return;
    }

    const studyHours = parseFloat(formData.StudyHours);
    const attendanceRate = parseFloat(formData.Attendance_rate);
    const previousGrade = parseFloat(formData.Previous_grade);
    const onlineClasses = parseFloat(formData.Online_classes);

    if (isNaN(studyHours)) {
      setError("Study Hours must be a valid number");
      return;
    }
    if (isNaN(attendanceRate)) {
      setError("Attendance Rate must be a valid number");
      return;
    }
    if (isNaN(previousGrade)) {
      setError("Previous Grade must be a valid number");
      return;
    }
    if (isNaN(onlineClasses)) {
      setError("Online Classes must be a valid number");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const apiUrl = process.env.API_URL || "http://localhost:5000";
      const modelParam = getModelParam();

      const requestData = {
        "Study Hours": studyHours,
        "Attendance Rate": attendanceRate,
        "Previous Grade": previousGrade,
        "Online Classes Taken": onlineClasses,
      };

      const response = await fetch(`${apiUrl}/predict?model=${modelParam}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || `HTTP error! status: ${response.status}`);
      } else {
        setPrediction(result as PredictionResult);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setError(
        "Error calculating prediction. Please check your inputs and ensure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const mockModelInfo = {
    metrics: {
      linear_regression: {
        r2_score: 0.848,
        mae: 63086,
        mse: 5718940941,
        rmse: 75624,
      },
      random_forest: {
        r2_score: 0.859,
        mae: 52524,
        mse: 5283317455,
        rmse: 72686,
      },
      best_model: "Random Forest",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="relative backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Home className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                  Student Performance Predictor
                </h1>
                <p className="text-lg text-slate-600 font-medium">
                  Student Performance Prediction Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 relative flex flex-col">
            <Card className="relative backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-2xl overflow-hidden flex-1">
              <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <CardHeader className="relative z-10 pb-8 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Calculator className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">
                          Student Performance Prediction
                        </CardTitle>
                        <CardDescription className="text-blue-100 text-base mt-1">
                          Predict student final grades using advanced algorithms
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <Label className="text-lg font-semibold text-slate-800">
                      Student Details
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        Study Hours
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.StudyHours}
                        onChange={(e) =>
                          handleInputChange("StudyHours", e.target.value)
                        }
                        className="text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        Attendance Rate
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.Attendance_rate}
                        onChange={(e) =>
                          handleInputChange("Attendance_rate", e.target.value)
                        }
                        className="text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-3"> 
                      <Label className="text-sm font-medium text-slate-700">
                        Previous Grade
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.Previous_grade}
                        onChange={(e) =>
                          handleInputChange("Previous_grade", e.target.value)
                        }
                        className="text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        Online Classes
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.Online_classes}
                        onChange={(e) =>
                          handleInputChange("Online_classes", e.target.value)
                        }
                        className="text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">
                        Predictor Selection
                      </Label>
                      <Select
                        value={formData.selectedPredictor}
                        onValueChange={(value) =>
                          handleInputChange("selectedPredictor", value)
                        }
                      >
                        <SelectTrigger className="text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="predictor-1">
                            Predictor-1
                          </SelectItem>
                          <SelectItem value="Predictor 2">
                            Predictor 2
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400"></div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <span className="text-red-600 text-sm">⚠️</span>
                      </div>
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span className="text-lg">Analyzing Student Data...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-6 w-6 transition-transform group-hover:scale-110" />
                          <span className="text-lg">Predict Final Grade</span>
                        </>
                      )}
                    </div>

                    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <span>🔒</span>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⚡</span>
                      <span>Instant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>✅</span>
                      <span>Accurate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {prediction && (
              <Card className="relative backdrop-blur-xl bg-white/95 border-0 shadow-2xl rounded-2xl overflow-hidden">
                <div className="relative bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 text-white">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardHeader className="relative z-10 pb-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white">
                            Student Performance Prediction
                          </CardTitle>
                          <div className="text-emerald-100 text-sm mt-1">
                            {getPredictorLabel()} Analysis
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </div>

                <CardContent className="p-8 space-y-6">
                  <div className="text-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                      {getPrimaryPrediction()}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                        {getPredictorLabel()} Result
                      </Badge>
                      <div className="text-sm text-slate-500">•</div>
                      <div className="text-sm text-slate-600">Predicted Grade</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-slate-800">
                        Model Information
                      </h4>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {prediction.model}
                          </div>
                          <div className="text-sm text-slate-500">
                            Converted prediction from backend
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-lg">
                          {getPrimaryPrediction()}
                        </div>
                        <div className="text-sm text-slate-500">Value</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!prediction && (
              <Card className="relative backdrop-blur-xl bg-white/95 border-0 shadow-2xl rounded-2xl overflow-hidden">
                <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardHeader className="relative z-10 pb-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-white">
                            Performance Analytics
                          </CardTitle>
                          <div className="text-indigo-100 text-sm mt-1">
                            Model accuracy and reliability metrics
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Demo Active</Badge>
                    </div>
                  </CardHeader>
                </div>

                <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="grid gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold text-blue-900">Standard Analysis</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-900">
                          {(mockModelInfo.metrics.linear_regression.r2_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={mockModelInfo.metrics.linear_regression.r2_score * 100} className="h-3 bg-blue-200" />
                      <div className="mt-2 text-sm text-blue-600">R² Score • Linear Regression</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-semibold text-purple-900">Advanced AI Model</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-900">
                          {(mockModelInfo.metrics.random_forest.r2_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={mockModelInfo.metrics.random_forest.r2_score * 100} className="h-3 bg-purple-200" />
                      <div className="mt-2 text-sm text-purple-600">R² Score • Random Forest</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}