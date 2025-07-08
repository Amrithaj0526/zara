#!/bin/bash
# Get the directory of this script (project root)
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/.venv/bin/activate"
export FLASK_APP=app.backend.app:create_app
flask run 