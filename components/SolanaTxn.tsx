import {
  useSolanaSigner,
  useSolanaTransaction,
} from "@account-kit/react-native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SolanaTxn() {
  const signer = useSolanaSigner();
  const [isLoading, setIsLoading] = useState(false);
  const { sendTransactionAsync } = useSolanaTransaction();

  const handleSendTransaction = async () => {
    if (!signer) {
      Alert.alert("Error", "Wallet not connected");
      return;
    }

    setIsLoading(true);

    try {
      const txSignature = await sendTransactionAsync({
        transfer: {
          toAddress: signer.address,
          amount: 0,
        },
        confirmationOptions: {
          enablePolling: true,
        },
      });

      Alert.alert(
        "Transaction Successful! 🎉",
        `Successfully sent 0.001 SOL!\n\nTransaction: ${txSignature.hash.slice(
          0,
          8
        )}...${txSignature.hash.slice(-8)}`,
        [
          {
            text: "View on Explorer",
            onPress: () => {
              // In a real app, you'd open the browser to the explorer
              console.log(
                `https://explorer.solana.com/tx/${txSignature.hash}?cluster=devnet`
              );
            },
          },
          { text: "OK", style: "default" },
        ]
      );
    } catch (error: any) {
      console.error("Transaction failed:", error);

      Alert.alert("Transaction Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!signer) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Connecting wallet...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.walletInfo}>
        <Text style={styles.label}>Solana Wallet</Text>
        <Text style={styles.address}>
          {signer.address}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendTransaction}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Sending Transaction..." : "Send Sponsored SOL txn"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        This will send 0 SOL to yourself as a test transaction
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  walletInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
    fontWeight: "500",
  },
  address: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: "#9945FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#adb5bd",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
});
