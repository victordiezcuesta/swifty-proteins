import {ReactNode, useRef} from 'react';
import {LayoutChangeEvent, PanResponder, View} from 'react-native';

import {styles} from '../../styles/GestureControls.styles';

type TouchPoint = {
    pageX: number;
    pageY: number;
};

type GestureControlsProps = {
    children: ReactNode;
    onRotate: (dx: number, dy: number) => void;
    onZoom: (scale: number) => void;
    onTap?: (x: number, y: number, width: number, height: number) => void; //el ? es que es opcional
};

const TAP_MAX_MOVE = 10;   // px
const TAP_MAX_TIME = 300;  // ms

function copyTouches(touches: readonly TouchPoint[]): TouchPoint[] //guardamos una copia de la posicion de los deddos
{
    return touches.map(touch => ({pageX: touch.pageX, pageY: touch.pageY}));
}

export default function GestureControls({children, onRotate, onZoom, onTap}: GestureControlsProps)
{
    const previousTouches = useRef<TouchPoint[]>([]);

    const size = useRef({width: 1, height: 1});
    const tap = useRef({x: 0, y: 0, startX: 0, startY: 0, time: 0, valid: false});
    const onTapRef = useRef(onTap);
    onTapRef.current = onTap; // evita closures obsoletas dentro del PanResponder

    const responder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true, //Cuando empieza un toque(pan) quiero que este PanResponder se haga responsable del gesto

            onMoveShouldSetPanResponder: () => true, //Si el usuario empieza a mover el dedo, PanResponder se haga responsable del gesto

            onPanResponderGrant: event => //El gesto acaba de empezar | event = contiene información del evento
            {
                previousTouches.current = copyTouches(event.nativeEvent.touches);

                const n = event.nativeEvent;

                tap.current = {
                    x: n.locationX, //donde se producjo el pan
                    y: n.locationY,
                    startX: n.pageX, //cuanto se han movido los dedos
                    startY: n.pageY,
                    time: Date.now(),
                    valid: n.touches.length === 1, //event.nativeEvent.touches es una lista de los dedos que están tocando actualmente.
                };
            },

            onPanResponderMove: event =>
            {
                const touches = event.nativeEvent.touches;
                const previous = previousTouches.current;

                if (touches.length === 0)
                    return;

                if (touches.length > 1 || Math.hypot(touches[0].pageX - tap.current.startX, touches[0].pageY - tap.current.startY) > TAP_MAX_MOVE) //invalidamos el tap si nos desplzamos mas de 10px
                    tap.current.valid = false;

                if (touches.length !== previous.length) //Si cambia el número de dedos, reiniciamos la referencia
                {
                    previousTouches.current = copyTouches(touches);
                    return;
                }

                if (touches.length === 1) //rotamos
                {
                    onRotate(
                        touches[0].pageX - previous[0].pageX,
                        touches[0].pageY - previous[0].pageY,
                    );
                }
                else //hacemos zoom
                {
                    //calculamos la distancia entre los dos dedos ahora mismo
                    const currentDistance = Math.hypot(
                        touches[0].pageX - touches[1].pageX,
                        touches[0].pageY - touches[1].pageY,
                    );

                    // calculamos la distancia que habia entre los dos dedos en el evento anterior
                    const previousDistance = Math.hypot(
                        previous[0].pageX - previous[1].pageX,
                        previous[0].pageY - previous[1].pageY,
                    );

                    if (previousDistance > 0)
                        onZoom(currentDistance / previousDistance);
                }

                previousTouches.current = copyTouches(touches);
            },

            onPanResponderRelease: () => //el usuario ah terminado el pan, es decir ha levantado el dedo
            {
                previousTouches.current = [];

                const t = tap.current; //recuperamos toda la informacion
                if (t.valid && Date.now() - t.time < TAP_MAX_TIME)
                    onTapRef.current?.(t.x, t.y, size.current.width, size.current.height);
                t.valid = false;
            },

            onPanResponderTerminate: () =>//el pan fue interrumpido o cancelado
            {
                previousTouches.current = [];
                tap.current.valid = false;
            },
        }),
    ).current;

    return (
        <View style={styles.container}>
            {children}
            <View
                style={styles.gestureLayer}
                onLayout={(e: LayoutChangeEvent) => { size.current = e.nativeEvent.layout; }}  // NUEVO
                {...responder.panHandlers}
            />
        </View>
    );
}