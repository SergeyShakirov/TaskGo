import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#999999"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333333",
  },
  required: {
    color: "#DC3545",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#DC3545",
  },
  error: {
    fontSize: 14,
    color: "#DC3545",
    marginTop: 4,
  },
});
