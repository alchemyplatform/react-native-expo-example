import SolanaTxn from "@/components/SolanaTxn";
import { alchemy } from "@account-kit/infra";
import {
  useAuthenticate,
  useConnection,
  useLogout,
  useSigner,
  useSignerStatus,
  useUser,
} from "@account-kit/react-native";
import {
  createSmartWalletClient,
  type SmartWalletClient,
} from "@account-kit/wallet-client";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Hex } from "viem";

export default function HomeScreen() {
  const { authenticateAsync } = useAuthenticate();
  const { isConnected } = useSignerStatus();
  const [smartWallet, setSmartWallet] = useState<SmartWalletClient>();
  const signer = useSigner();
  const [email, setEmail] = useState<string>("");
  const user = useUser();
  const { logout } = useLogout();
  const [awaitingOtp, setAwaitingOtp] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [address, setAddress] = useState<Hex | null>(null);
  const { transport, chain } = useConnection();

  const handleUserAuth = ({ code }: { code: string }) => {
    setAwaitingOtp(false);

    authenticateAsync({
      otpCode: code,
      type: "otp",
    }).catch(console.error);

    // Clear the OTP code after authentication
    setOtpCode("");
  };

  useEffect(() => {
    if (isConnected && signer) {
      const client = createSmartWalletClient({
        transport: alchemy(transport),
        chain,
        signer,
        mode: "local",
      });
      setSmartWallet(client);
      client.requestAccount().then((account) => {
        setAddress(account.address);
      });
    }
  }, [isConnected, signer]);

  return (
    <View style={styles.container}>
      {awaitingOtp ? (
        <>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="gray"
            placeholder="enter your OTP code"
            onChangeText={setOtpCode}
            value={otpCode}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUserAuth({ code: otpCode })}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </>
      ) : !user ? (
        <>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="gray"
            placeholder="enter your email"
            onChangeText={setEmail}
            value={email}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              authenticateAsync({
                email,
                type: "email",
              }).catch(console.error);

              setAwaitingOtp(true);
            }}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.userText}>
            Currently logged in as: {user.email}
          </Text>
          <Text style={styles.userText}>OrgId: {user.orgId}</Text>
          <Text style={styles.userText}>
            Smart Account Address: {address ?? "loading..."}
          </Text>
          <SolanaTxn />
          <TouchableOpacity style={styles.button} onPress={() => logout()}>
            <Text style={styles.buttonText}>Sign out</Text>
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
    backgroundColor: "#FFFFF",
    paddingHorizontal: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginTop: 20,
    marginBottom: 10,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    width: 200,
    padding: 10,
    height: 50,
    backgroundColor: "rgb(147, 197, 253)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  userText: {
    marginBottom: 10,
    fontSize: 18,
  },
});
