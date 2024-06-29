import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(true); // State to control camera view
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      setShowCamera(false); // Hide camera view after capturing photo
      await sendToBackend(photo.uri); // Send captured photo to backend
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const sendToBackend = async (photoUri) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any headers your backend requires, e.g., authorization token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      // Handle success if needed
      console.log('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Handle error
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null); // Clear captured photo
    setShowCamera(true); // Show camera view again
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={takePicture}>
              <Ionicons name="camera" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="images-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: capturedPhoto }} style={{ flex: 1 }} />
          <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});