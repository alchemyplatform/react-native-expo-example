import {
  useAuthenticate,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react-native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PasskeyScreen() {
  const { authenticateAsync } = useAuthenticate();
  const { isConnected } = useSignerStatus();
  const user = useUser();
  const { logout } = useLogout();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleCreatePasskey = async () => {
    setIsAuthenticating(true);
    try {
      await authenticateAsync({
        type: "passkey",
        createNew: true,
        username: "passkey"
      });
    } catch (error) {
      console.error("Failed to create passkey:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignInWithPasskey = async () => {
    setIsAuthenticating(true);
    try {
      await authenticateAsync({
        type: "passkey",
        createNew: false,
      });
    } catch (error) {
      console.error("Failed to sign in with passkey:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <>
          <Text style={styles.title}>Passkey Authentication</Text>
          <Text style={styles.subtitle}>
            Sign in or create an account using biometric authentication
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSignInWithPasskey}
            disabled={isAuthenticating}
          >
            <Text style={styles.buttonText}>
              {isAuthenticating ? "Authenticating..." : "Sign In with Passkey"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCreatePasskey}
            disabled={isAuthenticating}
          >
            <Text style={styles.secondaryButtonText}>
              {isAuthenticating ? "Creating..." : "Create New Passkey"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Authenticated</Text>
          <Text style={styles.userText}>User ID: {user.userId}</Text>
          <Text style={styles.userText}>Org ID: {user.orgId}</Text>
          {user.email && (
            <Text style={styles.userText}>Email: {user.email}</Text>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => logout()}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    maxWidth: 300,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  primaryButton: {
    backgroundColor: "rgb(147, 197, 253)",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "rgb(147, 197, 253)",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "rgb(147, 197, 253)",
    fontWeight: "600",
    fontSize: 16,
  },
  userText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
});