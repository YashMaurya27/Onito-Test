export interface PersonalDetailsI {
  name: string;
  age: Number;
  sex: "Male" | "Female";
  mobile: string;
  govtIdType: "Aadhar" | "PAN";
  govtId: string;
}

export interface AddressDetailsI {
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: Number;
}
