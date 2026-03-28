import joblib
import json
from numpy import record
import pandas as pd


# load important
TRAIN_COLUMNS = json.load( open("models/train_columns.json"))
SCALER = joblib.load("models/student_scaler.pkl")

# convert row input

def convert_row_input(record : dict) -> pd.DataFrame:
   """
    Convert raw input (Study Hours, Attendance Rate, Previous Grade, Online Classes)
    into the engineered, one-hot, scaled feature row that matches training.
    Returns a 1-row DataFrame with columns == TRAIN_COLUMNS.
    """ 
    
   stdhours= float (record.get("Study Hours", 0.0))
   attendanceRate = float (record.get("Attendance Rate", 0.0))
   previous_grade = float (record.get("Previous Grade", 0.0))
   online_classes = float (record.get("Online Classes Taken", 0.0))


    # Recreate engineered features exactly like Lesson-3
   StudyPerDay = ((stdhours  / 7)  if stdhours else 0.0 )
   StudyEfficiency = (stdhours / previous_grade) if previous_grade else 0.0
   AttendanceEfficiency = ((stdhours) / attendanceRate if attendanceRate else 0.0)

   # Build a full row with zeros for all training columns
   row_dict = {col: 0.0 for col in TRAIN_COLUMNS}
   for name ,val in [
         ("Study Hours", stdhours),
         ("AttendanceRate", attendanceRate),
         ("PreviousGrade", previous_grade),
         ("Online Classes Taken", online_classes),
         ("StudyPerDay", StudyPerDay),
         ("StudyEfficiency", StudyEfficiency),
         ("AttendanceEfficiency", AttendanceEfficiency)

     ]:
         if name in row_dict:
             row_dict[name] = float(val)

    # Create DataFrame and scale features
   df_row = pd.DataFrame([row_dict] ,columns = TRAIN_COLUMNS)
   if hasattr(SCALER, "feature_names_in_"):
    features_to_scale = list(SCALER.feature_names_in_)
    df_row[features_to_scale] = SCALER.transform(df_row[features_to_scale])

    return df_row




