from mongodb import connectionBD
from pprint import pprint

col = connectionBD()
if col is not None:
    msg = list(col.find().sort('_id', -1).limit(1))[0]
    print('Último mensaje:')
    pprint(msg)
    print(f'Tipo fecha: {type(msg["fecha_envio"])}')
    print(f'Fecha raw: {msg["fecha_envio"]}')
    
    # Verificar si tiene timezone info
    fecha = msg["fecha_envio"]
    if hasattr(fecha, 'tzinfo'):
        print(f'Timezone: {fecha.tzinfo}')
    
    from datetime import datetime
    print(f'Fecha actual local: {datetime.now()}')
else:
    print('Error de conexión')