/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { rect, rrect, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { SkiaCamera } from 'react-native-vision-camera-skia';
import {
  createWorkletRuntime,
  scheduleOnRN,
  scheduleOnRuntime,
  scheduleOnUI,
} from 'react-native-worklets';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const backgroundThread = createWorkletRuntime({
  name: '123123',
  initializer() {
    'worklet';

    console.log('init');
  },
});

const paint = Skia.Paint();
paint.setColor(Skia.Color('red'));

const CAMERA_ENABLED = false;

function AppContent() {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const { width, height } = useWindowDimensions();

  const testFn = () => {
    console.log('testing from rn');
  };

  useEffect(() => {
    scheduleOnUI(() => {
      'worklet';

      scheduleOnRN(testFn);

      scheduleOnRuntime(backgroundThread, () => {
        'worklet';

        console.log('testing from backgroundThread');

        // this is not working
        scheduleOnRN(testFn);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {CAMERA_ENABLED && hasPermission && device && (
        <SkiaCamera
          device={device}
          onFrame={(frame, render) => {
            'worklet';

            render(({ canvas, frameTexture }) => {
              'worklet';

              scheduleOnRN(testFn);

              scheduleOnRuntime(backgroundThread, () => {
                'worklet';

                console.log('testing from backgroundThread');

                // this is not working
                // scheduleOnRN(testFn);
              });

              canvas.drawImage(frameTexture, 0, 0);

              canvas.drawRRect(
                rrect(rect(width / 2 + 300 / 2, height / 2, 300, 300), 20, 20),
                paint,
              );
            });

            frame.dispose();
          }}
          isActive
          pixelFormat="yuv"
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
