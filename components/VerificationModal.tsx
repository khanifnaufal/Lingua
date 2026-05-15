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
}

export default function VerificationModal({
  visible,
  onClose,
  email,
}: VerificationModalProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  useEffect(() => {
    if (code.length === 6) {
      // Simulate verification delay
      setTimeout(() => {
        onClose();
        router.replace("/");
      }, 500);
    }
  }, [code, router, onClose]);

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

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-between w-full mb-8"
            >
              {renderCodeInputs()}
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={(text) => {
                if (text.length <= 6) setCode(text.replace(/[^0-9]/g, ""));
              }}
              keyboardType="number-pad"
              className="absolute w-1 h-1 opacity-0"
              maxLength={6}
              caretHidden
            />

            <TouchableOpacity
              onPress={() => setCode("")}
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
