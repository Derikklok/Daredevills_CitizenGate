# app/routers/analytics.py
from fastapi import APIRouter
from sqlalchemy import text
from app.database import engine


router = APIRouter()

@router.get("/peak_hours")
def get_peak_hours():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT EXTRACT(HOUR FROM appointment_time) AS hour, COUNT(*) AS booking_count
            FROM appointments
            GROUP BY hour
            ORDER BY hour
        """))
        return [dict(row._mapping) for row in result]

@router.get("/peak_hours")
def get_peak_hours():
    # Group by hour and count appointments
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT EXTRACT(HOUR FROM appointment_time) AS hour, COUNT(*) AS booking_count
            FROM appointments
            GROUP BY hour
            ORDER BY hour
        """))
        data = [dict(row._mapping) for row in result]
    return data

@router.get("/departmental_workload")
def get_departmental_workload():
    # Join appointments, government_services, and departments for department workload
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT d.name AS department_name,
                COUNT(*) FILTER (WHERE a.appointment_status = 'pending') AS pending,
                COUNT(*) FILTER (WHERE a.appointment_status = 'completed') AS completed,
                COUNT(*) FILTER (WHERE a.appointment_status = 'cancelled') AS cancelled,
                COUNT(*) FILTER (WHERE a.appointment_status = 'no_show') AS no_show,
                COUNT(*) AS total
            FROM appointments a
            JOIN government_services gs ON a.service_id = gs.service_id
            JOIN departments d ON gs.department_id = d.department_id
            GROUP BY d.department_id, d.name
            ORDER BY d.department_id
        """))
        data = [dict(row._mapping) for row in result]
    return data

@router.get("/no_show_analysis")
def get_no_show_analysis():
    # Group by status and age group, count no-shows
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT 
                CASE 
                    WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 36 AND 45 THEN '36-45'
                    WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 46 AND 55 THEN '46-55'
                    WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 56 AND 65 THEN '56-65'
                    ELSE '65+'
                END AS age_group,
                gender,
                COUNT(*) FILTER (WHERE appointment_status = 'no_show') AS no_show_count,
                COUNT(*) AS total
            FROM appointments
            GROUP BY age_group, gender
        """))
        data = [dict(row._mapping) for row in result]
    return data

@router.get("/processing_times")
def get_processing_times():
    # Average processing time by service
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT service_id, AVG(EXTRACT(EPOCH FROM appointment_time)/60) AS avg_processing_minutes
            FROM appointments
            WHERE appointment_status = 'completed'
            GROUP BY service_id
        """))
        data = [dict(row._mapping) for row in result]
    return data

@router.get("/overview")
def get_overview():
    # Summary metrics
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT COUNT(*) AS total_appointments,
                   COUNT(*) FILTER (WHERE appointment_status = 'completed') AS completed,
                   COUNT(*) FILTER (WHERE appointment_status = 'no_show') AS no_show,
                   COUNT(*) FILTER (WHERE appointment_status = 'cancelled') AS cancelled
            FROM appointments
        """))
        data = [dict(row._mapping) for row in result]
    return data

