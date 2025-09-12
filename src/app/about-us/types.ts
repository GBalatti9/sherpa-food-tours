export interface LocalGuide {
  profile_picture: number; // Puede ser ID o URL
  name: string;
  city: string;
  description: string;
  favorite_dish: string;
  country_flag: number; // Puede ser ID o URL
}

export interface ValueItem {
  title: string;
  description: string;
  background_image: number;
}

export interface AcfData {
  first_local_guide: LocalGuide;
  second_local_guide: LocalGuide;
  third_local_guide: LocalGuide;
  fourth_local_guide: LocalGuide;
  fifth_local_guide: LocalGuide;
  sixth_local_guide: LocalGuide;
  seventh_local_guide: LocalGuide;
  eighth_local_guide: LocalGuide;
  ninth_local_guide: LocalGuide;
  tenth_local_guide: LocalGuide;
  first_value: ValueItem;
  second_value: ValueItem;
  third_value: ValueItem;
  fourth_value: ValueItem;
  fifth_value: ValueItem;
  sixth_value: ValueItem;
  seventh_value: ValueItem;
  eighth_value: ValueItem;
  ninth_value: ValueItem;
  tenth_value: ValueItem;
}

export interface AboutUsInfo {
  title: string;
  content: string;
  acf: AcfData;
}
