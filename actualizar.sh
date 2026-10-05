#!/bin/bash

OUTPUT="notas-protein.txt"
SCRIPT_NAME="$(basename "$0")"

{
	echo "========================================"
	echo "ESTRUCTURA DEL PROYECTO"
	echo "========================================"
	echo

	tree -I ".expo|node_modules|notas-protein.txt|$SCRIPT_NAME"

	echo
	echo
	echo "========================================"
	echo "CONTENIDO DE LOS ARCHIVOS"
	echo "========================================"

	find . \
		-path "./.expo" -prune -o \
		-path "./node_modules" -prune -o \
		-path "./assets" -prune -o \
		-path "./.git" -prune -o \
		-type f \
		! -name "notas-protein.txt" \
		! -name "package-lock.json" \
		! -name "LICENSE" \
		! -name "AGENTS.md" \
		! -name "$SCRIPT_NAME" \
		! -name "subject.txt" \
		-print |
	while read -r file; do

		echo
		echo "========================================"
		echo "ARCHIVO: $file"
		echo "========================================"
		echo

		cat "$file"

	done

} > "$OUTPUT"

echo "Archivo $OUTPUT generado correctamente."