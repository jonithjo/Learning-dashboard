@echo off
:: Convenience script to run the Course Tracker backend
:: Sets JAVA_HOME and uses the local Maven distribution

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set MVN=D:\Project1\maven-dist\apache-maven-3.9.6\bin\mvn.cmd

echo.
echo ================================================
echo   Course Tracker Backend
echo   Java:  %JAVA_HOME%
echo   Maven: %MVN%
echo ================================================
echo.
echo [!] Make sure PostgreSQL is running and the
echo     database 'coursetracker' exists before starting.
echo.
echo     Quick setup (run in psql):
echo       CREATE DATABASE coursetracker;
echo.
echo Starting server on http://localhost:8080 ...
echo.

"%MVN%" spring-boot:run
