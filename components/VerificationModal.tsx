import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerify?: (code: string) => Promise<boolean>;
  onResend?: () => void;
}

export default function VerificationModal({
  visible,
  onClose,
  email,
  onVerify,
  onResend,
}: VerificationModalProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) {
      setCode("");
      setError("");
    }
  }, [visible]);

  const handleCodeChange = async (text: string) => {
    const newCode = text.replace(/[^0-9]/g, "");
    setCode(newCode);

    if (newCode.length === 6 && onVerify) {
      setLoading(true);
      setError("");
      try {
        const success = await onVerify(newCode);
        if (success) {
          onClose();
        } else {
          setCode("");
          setError("Verification failed or incomplete.");
        }
      } catch (err: any) {
        console.error("Verification error:", err?.message || err);
        setCode("");
        setError(err?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCodeInputs = () => {
    const inputs = [];
    for (let i = 0; i < 6; i++) {
      const char = code[i] || "";
      const isFocused = code.length === i;
      inputs.push(
        <View
          key={i}
          pointerEvents="none"
          className={`w-12 h-14 border-2 rounded-xl items-center justify-center bg-white ${
            isFocused ? "border-purple" : "border-border"
          }`}
        >
          <Text className="font-poppins-bold text-[24px] text-text-primary">
            {char}
          </Text>
        </View>
      );
    }
    return inputs;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => {
        // Safe and robust way to focus after modal appears
        inputRef.current?.focus();
      }}
    >
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="bg-white rounded-t-[32px] p-8"
        >
          <View className="items-center">
            <View className="w-12 h-1.5 bg-border rounded-full mb-6" />
            <Text className="h2 text-center">Verify your email</Text>
            <Text className="body-md text-center mt-2 mb-8">
              We've sent a 6-digit code to{"\n"}
              <Text className="font-poppins-semibold text-text-primary">
                {email || "your email"}
              </Text>
            </Text>

            {error ? (
              <Text className="text-red-500 font-poppins-medium text-[14px] mb-4 text-center">
                {error}
              </Text>
            ) : null}

            <View className="flex-row justify-between w-full mb-8 relative">
              {renderCodeInputs()}
              
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                caretHidden
                autoFocus
                className="absolute w-full h-full"
                style={{ color: "transparent", opacity: 0.01 }}
              />
            </View>



            <TouchableOpacity
              onPress={() => {
                setCode("");
                if (onResend) onResend();
              }}
              className="py-2"
              activeOpacity={0.7}
            >
              <Text className="font-poppins-semibold text-purple">
                Resend code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="mt-4 py-2"
              activeOpacity={0.7}
            >
              <Text className="font-poppins-medium text-text-secondary">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
