# install_requirements.ps1
# Script PowerShell para crear un virtualenv y instalar dependencias

$venvPath = ".venv"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}

Write-Host "Activando el virtualenv..."
& .\.venv\Scripts\Activate.ps1

Write-Host "Actualizando pip..."
python -m pip install --upgrade pip

Write-Host "Instalando dependencias desde requirements.txt..."
python -m pip install -r requirements.txt

Write-Host "Instalación completada. Para ejecutar la app: cd backend; python app.py"