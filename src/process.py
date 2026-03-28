import json
import os

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

# load dataset
df = pd.read_csv("dataset/student_performance.csv")

# initial snapshot of the data
print("\n === initial head === ")
print(df.head())

print("\n === initial info === ")
print(df.info())

print("\n === initial missing values === ")
print(df.isnull().sum())


# removing unnecessary columns
df.drop(['Name' , 'StudentID' , 'Attendance (%)'] , axis=1 , inplace =True )

# I did not fill the missing values in the target column (FinalGrade)
#  because it is what the model is supposed to predict. I removed the rows
#  with missing values to ensure the model is trained on clean and reliable data

df = df.dropna(subset=['FinalGrade'])

# missing value



df["Gender"] = df["Gender"] .fillna ( df["Gender"] .mode()[0])
df["AttendanceRate"] = df["AttendanceRate"] .fillna ( df["AttendanceRate"] .mean())
df["StudyHoursPerWeek"] = df["StudyHoursPerWeek"] .fillna ( df["StudyHoursPerWeek"] .mean())
df["PreviousGrade"] = df["PreviousGrade"] .fillna ( df["PreviousGrade"] .mean())
df["ExtracurricularActivities"] = df["ExtracurricularActivities"] .fillna ( df["ExtracurricularActivities"] .mean())
df["ParentalSupport"] = df["ParentalSupport"] .fillna ( df["ParentalSupport"] .mode()[0])
df["Study Hours"] = df["Study Hours"] .fillna ( df["Study Hours"] .mean())
df["Online Classes Taken"] = df["Online Classes Taken"] .fillna ( df["Online Classes Taken"] .mode()[0])

# print(df.isnull().sum())


# encoding categorical variables
df["Gender"] = df["Gender"].map({"Male": 0, "Female": 1})
df["ParentalSupport"] = df["ParentalSupport"].map({"Low": 0, "Medium": 1, "High": 2})
df["OnlineClassesTaken"] = df["OnlineClassesTaken"].map({True: 1, False: 0})


# feature engineering
df["StudyPerDay"] = df["StudyHoursPerWeek"] / 7
df["StudyEfficiency"] = df["StudyHoursPerWeek"] / df["PreviousGrade"]
df["AttendanceEfficiency"] = df["StudyHoursPerWeek"] / df["AttendanceRate"]


# scalling features
dont_scale = ['FinalGrade']
features_to_scale = [col for col in df.columns if col not in dont_scale]
scaler = StandardScaler()
df[features_to_scale] = scaler.fit_transform(df[features_to_scale])
print(df.head())

# save scaler and feuters
os .makedirs("models" , exist_ok =True )
joblib.dump(scaler , 'models/student_scaler.pkl')
TRAIN_COLUMNS = df.drop(columns=["FinalGrade"]).columns.tolist()
json.dump(TRAIN_COLUMNS ,open ('models/train_columns.json' , "w"))



# final snapshot of the data
print("\n === final head === ") 
print(df.head())

print("\n === final info === ")
print(df.info())

print("\n === final missing values === ")
print(df.isnull().sum())



# save
OUTPUT_PATH = "dataset/processed_student_performance.csv"
df.to_csv(OUTPUT_PATH, index=False)




