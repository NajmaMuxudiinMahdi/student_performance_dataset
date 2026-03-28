# 🎓 Student Performance Prediction System

This is a Full-Stack Machine Learning application that predicts a student's final grade based on academic and behavioral features. The project compares two ML algorithms and provides a real-time prediction through a web interface.

---

## 🚀 Features
- **Machine Learning:** Comparison between **Linear Regression** and **Random Forest**.
- **API Backend:** Built with **Flask** (Python) to serve model predictions.
- **Modern Frontend:** Built with **Next.js** and **Tailwind CSS** for a responsive UI.
- **Dataset:** Analysis of 1,000 student records.

---

## 📊 Dataset Information
The model was trained on a dataset containing 1,000 samples with the following features:
- **Study Hours:** Number of hours spent studying per week.
- **Attendance Rate:** Percentage of classes attended.
- **Previous Grade:** Scores from the previous semester.
- **Online Classes:** Number of digital sessions attended.

---

## 🤖 Algorithms & Performance
I implemented two models to compare their accuracy:
1. **Linear Regression:** Used as a baseline model to identify linear trends.
2. **Random Forest:** Used to capture complex, non-linear patterns. 
   - *Result: Random Forest provided more stable and accurate predictions.*

---

## 🛠️ Project Structure
├── api/             # Flask Backend (server.py)
├── client/          # Next.js Frontend (React components)
├── dataset/         # Student_Performance.csv
├── models/          # Trained model files (.pkl)
└── project_paper.pdf # Detailed reflection paper (3-5 pages)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
git clone https://github.com/engNajma/s_performance.git
cd s_performance

### 2. Backend Setup (Python)
# Go to api folder
cd api

# Install dependencies
pip install flask flask-cors pandas scikit-learn joblib

# Run the server
python server.py

### 3. Frontend Setup (Next.js)
# Open a new terminal and go to client folder
cd client

# Install dependencies
npm install

# Run the frontend
npm run dev

---

## 🧪 API Usage Example
To get a prediction, send a POST request to the /predict endpoint:

**Request:**
curl -X POST http://localhost:5000/predict \
-H "Content-Type: application/json" \
-d '{"Study Hours": 12, "Attendance Rate": 95, "Previous Grade": 88, "Online Classes": 2}'

**Response:**
{
  "prediction": 84.5
}

---

## 📄 Documentation
A detailed Reflection Paper (3-5 pages) covering the problem statement, methodology, results, and lessons learned is included in this repository as project_paper.pdf.

---

**Author:** Eng Najma (engNajma)  
**Course:** Feb 2026 Data Science & ML Bootcamp  
**Submission Date:** March 27, 2026
