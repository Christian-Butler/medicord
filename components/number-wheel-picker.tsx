import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type NumberWheelPickerProps = {
  value: number;
  min?: number;
  max: number;
  label?: string;
  disabled?: boolean;
  displayValue?: string;
  onChange: (value: number) => void;
};

export default function NumberWheelPicker({
  value,
  min = 0,
  max,
  label,
  disabled = false,
  displayValue,
  onChange,
}: NumberWheelPickerProps) {
  const [visible, setVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const values = Array.from(
    { length: max - min + 1 },
    (_, index) => min + index
  );

  const buttonLabel = displayValue ?? (label ? `${value} ${label}` : String(value));

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => {
          setDraftValue(value);
          setVisible(true);
        }}
        className={`h-[40px] flex-row items-center justify-center rounded-[10px] border-[2px] border-[#97A5A8] bg-white px-2 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Text className="text-[14px] text-black">{buttonLabel}</Text>
        <ChevronDown size={15} color="#000" />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/30">
          <View className="rounded-t-[20px] bg-white pb-8 pt-3">
            <View className="flex-row items-center justify-between border-b border-[#E5E7EB] px-5 pb-3">
              <Pressable onPress={() => setVisible(false)}>
                <Text className="text-[17px] text-[#0D5175]">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  onChange(draftValue);
                  setVisible(false);
                }}
              >
                <Text className="text-[17px] font-semibold text-[#0D5175]">
                  Done
                </Text>
              </Pressable>
            </View>

            <Picker
              selectedValue={draftValue}
              onValueChange={(nextValue) => setDraftValue(Number(nextValue))}
              itemStyle={{
                fontSize: 22,
                height: 180,
              }}
            >
              {values.map((item) => (
                <Picker.Item
                  key={item}
                  label={label ? `${item} ${label}` : String(item)}
                  value={item}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </>
  );
}