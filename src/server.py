from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from utility import convert_row_input

app = Flask(__name__)
CORS(app)

# load model
model = {
    "lr" : joblib.load("models/lr_model.joblib"),
    "rf" : joblib.load("models/rf_model.joblib"),
}

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Student Performance Prediction API",
        "endpoints": {
            "POST /predict?model=lr|rf": {
                "expects_json": {
                    "StudyHours": "number",
                    "Attendance_rate": "number",
                    "Previous_grade": "number",
                    "Online_classes": "number"
                }
            }
        }
    })

@app.route("/predict", methods=["POST"])
def predict():

    # choose model
    model_name = request.args.get("model", "lr")
    if model_name not in model:
        return jsonify({"error": "Model not found. Use 'lr' or 'rf'."}), 400

      #read payload
    data = request.get_json(silent=True)or {}   
    required_fields = ["Study Hours", "Attendance Rate", "Previous Grade", "Online Classes Taken"]
    missing = [k for k in required_fields if k not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    try:
        # convert input to model features
        input_df = convert_row_input(data)

        # make prediction
        pred = model[model_name].predict(input_df)[0]
    except Exception as e:
        return jsonify({"error": f"Prediction error: {e}"}), 500

    return jsonify({ 
        "model" : "linear regression" if model_name == "lr" else "random forest",
        "input" : {
            "StudyHours": float(data.get("Study Hours", 0.0)),
            "Attendance_rate": float(data.get("Attendance Rate", 0.0)),
            "Previous_grade": float(data.get("Previous Grade", 0.0)),
            "Online_classes": float(data.get("Online Classes Taken", 0.0))
        },
        "predicted_final_grade": round(pred, 2)

    }) 

if __name__ == "__main__":
    app.run( host="0.0.0.0", debug=True)



   






