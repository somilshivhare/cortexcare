# PROJECT_CONTEXT.md

# CortexCare

Version: 1.0

Status:
In Development

Project Type:
AI-powered Clinical Workflow Platform

Owner:
<YOUR_NAME>

---

# IMPORTANT

This file is the single source of truth for the project.

Before suggesting code, architecture changes, folder structures, or new features, always follow this document.

Do not redesign the project unless explicitly asked.

The goal is consistency throughout development.

---

# Project Vision

CortexCare is an AI-powered Clinical Workflow Platform.

It is NOT an AI doctor.

It is NOT an AI therapist.

It is NOT another chatbot.

The goal is to reduce the documentation burden of healthcare professionals by collecting structured patient information before the consultation and organizing it into meaningful clinical context.

Doctors remain responsible for every medical decision.

AI only assists.

---

# Problem Statement

Healthcare professionals spend significant time collecting patient history and documenting consultations.

Patients often repeat the same information during every visit.

Doctors spend valuable consultation time understanding previous history instead of treating patients.

Most AI chatbots only provide one-time conversations and are disconnected from the actual clinical workflow.

CortexCare solves this by becoming an AI-powered clinical intake assistant that integrates into the doctor's workflow.

---

# Goals

Primary Goal

Reduce documentation workload.

Secondary Goals

• Collect patient information through natural conversation.
• Generate structured clinical context.
• Organize consultation history.
• Help doctors quickly understand previous visits.
• Track patient progress over time.
• Keep AI completely replaceable.

---

# Non Goals

CortexCare will NEVER

• Diagnose diseases.
• Prescribe medication.
• Replace doctors.
• Make medical decisions.
• Claim medical accuracy.

Doctors always make the final decision.

---

# Target Users

Current

• Patient
• Doctor

Future

• Clinic Administrator

---

# Core Value Proposition

Patient speaks once.

↓

AI organizes information.

↓

Doctor spends time treating instead of documenting.

The software improves workflow.

AI is only one component of that workflow.

---

# Product Workflow

Patient

↓

Landing Page

↓

Choose Role

↓

Patient Login / Register

↓

Patient Dashboard

↓

Start New Consultation

↓

Consultation Setup

↓

Microphone Permission

↓

Create Consultation

↓

Create LiveKit Session

↓

Voice Consultation

↓

Conversation saved as conversation chunks

↓

Patient ends consultation

↓

Finalize Transcript

↓

Clinical Context Engine

↓

Extract Structured Information

↓

Compare Previous Consultations

↓

Generate Recovery Insights

↓

Store Clinical Context

↓

Patient Summary

↓

Timeline Updated

↓

Doctor Dashboard Updated

---

# Doctor Workflow

(Current High Level)

Doctor Login

↓

Doctor Dashboard

↓

Pending Consultations

↓

Open Patient

↓

Review AI Summary

↓

Review Full Transcript

↓

Review Clinical Context

↓

Review Previous Timeline

↓

Add Doctor Notes

↓

Complete Consultation

This workflow will evolve later during development.

Do not redesign it unless requested.

---

# Core Features

Authentication

Role Based Access

Patient Dashboard

Voice Consultation

Conversation Persistence

Clinical Context Engine

Doctor Dashboard

Recovery Timeline

Historical Comparison

Doctor Notes

AI-assisted Documentation

---

# Unique Selling Proposition (USP)

This project is NOT an AI chatbot.

This project is workflow software.

Its value exists even without AI.

Without AI it is still useful because it stores patient history and organizes consultations.

AI makes the workflow faster and more intelligent.

The software should always be valuable even if Gemini is replaced.

---

# AI Responsibilities

AI should

• Conduct structured conversation.
• Generate summary.
• Extract structured information.
• Compare previous consultations.
• Generate recovery insights.

AI should NEVER

• Diagnose diseases.
• Replace doctors.
• Make final medical decisions.

AI output should always be structured whenever possible.

---

# Clinical Context Engine

Input

Conversation Transcript

Output

Structured Clinical Context

Example Fields

• Summary
• Symptoms
• Mood Indicators
• Stress Indicators
• Sleep Pattern
• Key Concerns
• Risk Flags
• Recovery Insights
• Confidence Score

Future versions may include prompt versioning.

---

# Recovery Timeline

Every consultation contributes structured data.

Future consultations compare structured historical information.

Example

Visit 1

Stress 8

Sleep 4 hours

↓

Visit 2

Stress 6

Sleep 6 hours

↓

Visit 3

Stress 3

Sleep 7 hours

The doctor immediately understands patient improvement.

---

# Backend Architecture

Architecture Style

Modular Monolith

Reason

Simple deployment.

Simple debugging.

Easy maintenance.

Future modules can become microservices if required.

---

# Backend Modules

Authentication

Patient

Consultation

Clinical Context

Doctor

Timeline

AI Provider

Workers

Shared

---

# Frontend Modules

Landing

Authentication

Patient Dashboard

Doctor Dashboard

Consultation

Timeline

Shared Components

Layouts

---

# Technology Stack

Frontend

• React
• Vite
• Tailwind CSS
• React Router
• Axios

Backend

• Node.js
• Express.js

Database

• PostgreSQL
• Prisma ORM

Realtime

• Socket.IO

Voice

• LiveKit

Queue

• BullMQ
• Redis

AI

• Gemini

Deployment

• Docker
• AWS EC2
• Nginx

Future

• GitHub Actions CI/CD

---

# Database Philosophy

PostgreSQL is the source of truth.

Reason

Healthcare information is highly relational.

Relationships exist between

User

↓

Patient

↓

Consultation

↓

Conversation Chunks

↓

Clinical Context

↓

Doctor Notes

↓

Timeline

Use

• Foreign Keys
• Transactions
• Normalization
• Indexes

The transcript is immutable.

Clinical Context is derived data.

Doctor Notes remain independent.

---

# Conversation Storage

Conversation is NOT stored as one large transcript.

Conversation is stored as ordered conversation chunks.

Benefits

• Resume interrupted consultations.
• Fault tolerance.
• Lower data loss.
• Better replay.
• Better analytics.
• Easier debugging.

Each chunk belongs to one consultation.

---

# Queue Philosophy

AI processing must NEVER block HTTP requests.

Workflow

Finalize Transcript

↓

Create BullMQ Job

↓

Worker picks job

↓

Gemini processes transcript

↓

Clinical Context generated

↓

Database updated

↓

Socket.IO updates doctor dashboard

---

# LiveKit Philosophy

LiveKit is responsible ONLY for voice communication.

Business logic never depends directly on LiveKit.

If voice technology changes in the future, only the integration layer should change.

Consultations continue to exist independently from LiveKit sessions.

---

# Security Philosophy

JWT Authentication

bcrypt Password Hashing

Protected Routes

Role Based Authorization

Environment Variables

HTTPS in Production

Input Validation

Never expose API Keys

Audit important AI actions

Never trust frontend input

---

# Engineering Principles

Keep code simple.

Keep files small.

Prefer readability.

Avoid unnecessary abstraction.

One responsibility per module.

One responsibility per service.

One responsibility per React component.

Controllers should stay thin.

Business logic belongs in Services.

Database logic belongs in Repositories.

Validation remains separate.

Never duplicate business logic.

---

# Coding Philosophy

The developer writes the first implementation.

AI reviews and improves.

Never generate an entire project.

Never replace learning with code generation.

AI acts like a Senior Engineer performing code review.

---

# AI Provider Philosophy

Never tightly couple the application to Gemini.

Always communicate through an AI Provider layer.

Future providers may include Claude or OpenAI.

Changing providers should not require changes to business logic.

---

# Scalability Philosophy

Design for current needs.

Keep future scaling possible.

Current Architecture

Modular Monolith

Future

Modules can be extracted into independent services if traffic grows.

Avoid premature optimization.

---

# Engineering Decisions

Current Decisions

Architecture
Modular Monolith

Database
PostgreSQL

ORM
Prisma

Queue
BullMQ

Queue Storage
Redis

Voice
LiveKit

Realtime
Socket.IO

Deployment
Docker on AWS EC2

Reason

Chosen for simplicity, maintainability, production readiness, and interview defensibility.

---

# Coding Standards

Use meaningful names.

Keep functions short.

Avoid deeply nested logic.

Write reusable services.

Handle errors consistently.

Validate every request.

Prefer async/await.

Comment WHY, not WHAT.

---

# AI Instructions

When helping with CortexCare:

DO

• Follow this architecture.
• Preserve folder structure.
• Explain engineering decisions.
• Keep code production-ready.
• Suggest best practices.
• Optimize readability.
• Explain trade-offs.

DO NOT

• Rewrite project architecture.
• Introduce unnecessary technologies.
• Replace PostgreSQL with MongoDB.
• Replace BullMQ unless requested.
• Generate massive files.
• Ignore modular architecture.
• Turn AI into a medical decision-maker.

Always prioritize maintainability over clever code.

---

# Current Sprint

Sprint 1

Current Focus

Backend Foundation

Current Feature

Authentication

Next Milestones

• Initialize Express
• Configure Prisma
• Connect PostgreSQL
• Create User model
• Register API
• Login API
• JWT Authentication
• Protected Routes

Everything else will be built incrementally after the backend foundation is complete.

---

# Learning Goal

The objective is NOT simply to finish CortexCare.

The objective is to become capable of designing and building production-ready backend systems independently.

Every major technology should be understood well enough to explain:

• What problem it solves.
• Why it was chosen.
• Why alternatives were rejected.
• How it fits into CortexCare.
• How to defend the decision in a technical interview.

This philosophy should guide every future contribution to the project.