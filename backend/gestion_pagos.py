from flask import Blueprint, jsonify, request
from bd import obtener_conexion
from datetime import datetime, date
from email.utils import parsedate_to_datetime
import re


def _normalize_fecha(fecha_val):
    if fecha_val is None:
        return None
    if isinstance(fecha_val, date) and not isinstance(fecha_val, datetime):
        return fecha_val.strftime('%Y-%m-%d %H:%M:%S')
    if isinstance(fecha_val, datetime):
        return fecha_val.strftime('%Y-%m-%d %H:%M:%S')
    if isinstance(fecha_val, str):
        s = fecha_val.strip()
        if s == '':
            return None
        # ISO
        try:
            dt = datetime.fromisoformat(s)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            pass
        try:
            dt = parsedate_to_datetime(s)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            pass
        for fmt in ('%d/%m/%Y %H:%M:%S', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
            try:
                dt = datetime.strptime(s, fmt)
                return dt.strftime('%Y-%m-%d %H:%M:%S')
            except Exception:
                continue
    return None


pagos_bp = Blueprint('pagos', __name__, url_prefix='/api/pagos')


def _format_pago_row(row):
    if not row:
        return None
    return {
        'id_pago': row.get('id_pago') or row.get('id'),
        'id_usuario': row.get('id_usuario'),
        'id_publicacion': row.get('id_publicacion'),
        'monto': row.get('monto'),
        'metodo_pago': row.get('metodo_pago'),
        'estado_pago': row.get('estado_pago'),
        'fecha_pago': row.get('fecha_pago'),
    }


@pagos_bp.route('/', methods=['GET'])
def obtener_pagos():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM pago')
        filas = cursor.fetchall()
    conexion.close()
    pagos = [_format_pago_row(f) for f in filas]
    return jsonify(pagos)


@pagos_bp.route('/', methods=['POST'])
def crear_pago():
    datos = request.json or {}
    id_usuario = datos.get('id_usuario')
    id_publicacion = datos.get('id_publicacion')
    monto = datos.get('monto')
    metodo_pago = datos.get('metodo_pago')
    estado_pago = datos.get('estado_pago') or 'PENDIENTE'
    fecha_pago = _normalize_fecha(datos.get('fecha_pago'))

    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO pago (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago),
        )
        new_id = cursor.lastrowid
    conexion.commit()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (new_id,))
        row = cursor.fetchone()
    conexion.close()
    return jsonify(row), 201


@pagos_bp.route('/<int:id_pago>', methods=['GET'])
def obtener_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
    conexion.close()
    if not row:
        return jsonify({'error': 'Pago no encontrado'}), 404
    return jsonify(row)


@pagos_bp.route('/<int:id_pago>', methods=['PUT'])
def editar_pago(id_pago):
    datos = request.json or {}
    # Obtener columnas seguras
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pago' AND TABLE_SCHEMA = DATABASE()")
        cols = {r['COLUMN_NAME'] for r in cursor.fetchall()}

    campos = []
    valores = []
    mapping = {
        'id_usuario': 'id_usuario',
        'id_publicacion': 'id_publicacion',
        'monto': 'monto',
        'metodo_pago': 'metodo_pago',
        'estado_pago': 'estado_pago',
        'fecha_pago': 'fecha_pago',
    }

    for k, v in datos.items():
        col = mapping.get(k) if k in mapping else (k if k in cols else None)
        if col:
            campos.append(f"{col} = %s")
            if col == 'fecha_pago':
                valores.append(_normalize_fecha(v))
            else:
                valores.append(v)

    if not campos:
        return jsonify({'error': 'No hay campos para actualizar'}), 400

    valores.append(id_pago)
    sql = f"UPDATE pago SET {', '.join(campos)} WHERE id_pago = %s"
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(sql, tuple(valores))
    conexion.commit()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
    conexion.close()
    if not row:
        return jsonify({'error': 'Pago no encontrado'}), 404
    return jsonify(row)


@pagos_bp.route('/<int:id_pago>', methods=['DELETE'])
def borrar_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        r = cursor.fetchone()
        if not r or r.get('cnt', 0) == 0:
            conexion.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    conexion.close()
    return jsonify({'mensaje': f'Pago {id_pago} eliminado correctamente'})


@pagos_bp.route('/<path:maybe_id>', methods=['DELETE'])
def borrar_pago_tolerante(maybe_id):
    id_pago = None
    try:
        id_pago = int(maybe_id)
    except Exception:
        m = re.search(r"(\d+)", str(maybe_id))
        if m:
            id_pago = int(m.group(1))
    if id_pago is None:
        return jsonify({'error': 'ID inválido'}), 400
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        r = cursor.fetchone()
        if not r or r.get('cnt', 0) == 0:
            conexion.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        after = cursor.fetchone()
        print(f"[borrar_pago_tolerante] after delete check for id={id_pago} -> {after}")
    conexion.close()
    return jsonify({'mensaje': f'Pago {id_pago} eliminado correctamente'})


@pagos_bp.route('/debug/check/<int:id_pago>', methods=['GET'])
def debug_check_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
        exists = bool(row and row.get('cnt', 0) > 0)
        pago = None
        if exists:
            cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
            pago = cursor.fetchone()
    conexion.close()
    return jsonify({'exists': exists, 'pago': pago})


@pagos_bp.route('/debug/force_delete/<int:id_pago>', methods=['DELETE'])
def debug_force_delete_pago(id_pago):
    print(f"[debug_force_delete_pago] request to delete id={id_pago}")
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        before = cursor.fetchone()
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        after = cursor.fetchone()
    conexion.close()
    print(f"[debug_force_delete_pago] before={before} after={after}")
    return jsonify({'before': before, 'after': after})