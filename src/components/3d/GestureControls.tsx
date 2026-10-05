import {ReactNode, useRef} from 'react';
import {LayoutChangeEvent, PanResponder, StyleSheet, View} from 'react-native';

type TouchPoint = {
    pageX: number;
    pageY: number;
};

type GestureControlsProps = {
    children: ReactNode;
    onRotate: (dx: number, dy: number) => void;
    onZoom: (scale: number) => void;
    onTap?: (x: number, y: number, width: number, height: number) => void;
};

const TAP_MAX_MOVE = 10;   // px
const TAP_MAX_TIME = 300;  // ms

function copyTouches(touches: readonly TouchPoint[]): TouchPoint[]
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
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: event =>
            {
                previousTouches.current = copyTouches(event.nativeEvent.touches);

                const n = event.nativeEvent;
                tap.current = {
                    x: n.locationX, y: n.locationY,
                    startX: n.pageX, startY: n.pageY,
                    time: Date.now(),
                    valid: n.touches.length === 1,
                };
            },

            onPanResponderMove: event =>
            {
                const touches = event.nativeEvent.touches;
                const previous = previousTouches.current;

                if (touches.length === 0)
                    return;

                // 1) Invalidar el tap (independiente de rotar/zoom)
                if (touches.length > 1 || Math.hypot(touches[0].pageX - tap.current.startX, touches[0].pageY - tap.current.startY) > TAP_MAX_MOVE)
                    tap.current.valid = false;

                // 2) Si cambia el número de dedos, reiniciamos la referencia
                if (touches.length !== previous.length)
                {
                    previousTouches.current = copyTouches(touches);
                    return;
                }

                // 3) Rotar o hacer zoom
                if (touches.length === 1)
                {
                    onRotate(
                        touches[0].pageX - previous[0].pageX,
                        touches[0].pageY - previous[0].pageY,
                    );
                }
                else
                {
                    const currentDistance = Math.hypot(
                        touches[0].pageX - touches[1].pageX,
                        touches[0].pageY - touches[1].pageY,
                    );

                    const previousDistance = Math.hypot(
                        previous[0].pageX - previous[1].pageX,
                        previous[0].pageY - previous[1].pageY,
                    );

                    if (previousDistance > 0)
                        onZoom(currentDistance / previousDistance);
                }

                previousTouches.current = copyTouches(touches);
            },

            onPanResponderRelease: () =>
            {
                previousTouches.current = [];

                const t = tap.current;
                if (t.valid && Date.now() - t.time < TAP_MAX_TIME)
                    onTapRef.current?.(t.x, t.y, size.current.width, size.current.height);
                t.valid = false;
            },
            onPanResponderTerminate: () => { previousTouches.current = []; tap.current.valid = false; },
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

const styles = StyleSheet.create({
    container: {flex: 1},
    gestureLayer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'transparent',
    },
});