import type {Product} from './inventory';
export type ManufacturerSpec = {label:string;value:string;source:string};
const spec=(label:string,value:string,source:string):ManufacturerSpec=>({label,value,source});
// Every entry describes an original manufacturer model-family or a possible configuration,
// not the installed components or condition of a particular second-hand unit.
const base='https://www.dell.com/support/manuals/en-us/';
const u5289=base+'latitude-12-5289-2-in-1-laptop/latitude-12-5289-2-in-1-laptop_owners-manual/';
const u5300=base+'latitude-13-5300-laptop/latitude_5300_setup_specs/';
const u5310=base+'latitude-13-5310-laptop/latitude_5310_ss/';
const u5310x=base+'latitude-13-5310-2-in-1-laptop/lati_5310_2_in_1_setupspecs/';
const u5320=base+'latitude-13-5320-2-in-1-laptop/latitude_5320_setup_and_specs/';
const u5410=base+'latitude-14-5410-laptop/latitude_5410_specs/';
const u5420=base+'latitude-5420-laptop/5420_sp14_setupspecs/';
const u5430=base+'latitude-5430-laptop/latitude_5430_ss/';
const u5440=base+'latitude-14-5440-laptop/latitude-5440-owners-manual/';
const u7310=base+'latitude-13-7310-2-in-1-laptop/lati_7310_ss/';
const u7320=base+'latitude-13-7320-2-in-1-laptop/latitude_7320_specs/';
const dell=(prefix:string,page:string,id:string)=>`${prefix}${page}?guid=guid-${id}&lang=en-us`;
const shared5320:ManufacturerSpec[]=[
 spec('Processor options','11th Gen Core i3-1125G4, i5-1135G7, i5-1145G7 or i7-1185G7; all four-core / eight-thread.',dell(u5320,'processor','40bb5393-cf73-4734-b4eb-1499afb0ee75')),
 spec('Graphics options','Intel UHD or Iris Xe integrated graphics; Iris Xe capability depends on processor and dual-channel memory.',dell(u5320,'processor','40bb5393-cf73-4734-b4eb-1499afb0ee75')),
 spec('Memory support','Onboard DDR4-3200; 4, 8, 16 or 32 GB configurations.',dell(u5320,'memory','e9d2ea83-38a4-431d-803c-96d63c1dbc34')),
 spec('Storage options','M.2 2230/2280 PCIe NVMe SSD options, from 128 GB to 2 TB depending on drive.',dell(u5320,'storage','12cf2b7a-17bd-4537-b0aa-c1f3aee7967a')),
 spec('Ports and slots','2 USB-A (one PowerShare), 2 Thunderbolt 4 / USB-C with DisplayPort and power delivery, HDMI 2.0, audio jack and microSD.',dell(u5320,'external-ports','b4f1c447-0ef1-42b1-8133-2986dfd4b5a5')),
 spec('Battery options','3-cell 42 Wh or 4-cell 63 Wh lithium-ion; actual battery health and runtime depend on the individual unit.',dell(u5320,'battery','3bdd00ab-5cd5-4122-b7bc-4d68b6928a0b')),
 spec('Dimensions and weight','305.70 × 207.50 × 16.96 mm; minimum 1.18 kg laptop or 1.32 kg 2-in-1; varies by configuration.',dell(u5320,'dimensions-and-weight','1d9dde8d-b368-442b-a9d2-23af0d27efbf')),
];
const profiles:Record<string,ManufacturerSpec[]>={
 'Dell Latitude 5289 x360':[
  spec('Processor options','7th Gen Intel Core i3-7100U, i5-7200U, i5-7300U or i7-7600U.',dell(u5289,'processor-specifications','d7d49f61-0ab1-4746-affc-1e05321b18af')),
  spec('Memory support','Onboard LPDDR3-1866; up to 16 GB.',dell(u5289,'memory-specifications','bc21d112-84c0-4438-a373-0055439571ab')),
  spec('Storage options','M.2 SATA or PCIe NVMe SSD options; capacity and drive type vary.',dell(u5289,'storage-options','392737db-5055-45cf-9031-fb0043568203')),
  spec('Ports and slots','2 USB 3.1 Gen 1 Type-A (one PowerShare), 2 USB-C 3.1 Gen 1, HDMI 1.4, audio jack and microSD.',dell(u5289,'ports-and-connector-specifications','92eb43c8-f525-4706-a193-71941f474ab4')),
  spec('Battery options','45 Wh or 60 Wh polymer battery; health varies by unit.',dell(u5289,'battery-specifications','4ee454df-555b-4c46-89a5-3ed938f829e3')),
  spec('Dimensions and weight','304.8 × 210.0 × 12.03–18.45 mm; 1.34 kg, varies by configuration.',dell(u5289,'physical-specifications','a6ab66dd-40d4-4802-92b6-7c144583ab75')),
 ],
 'Dell Latitude 5300':[
  spec('Memory support','2 SO-DIMM slots, DDR4, up to 32 GB; runs at 2400 MHz with 8th Gen CPUs.',dell(u5300,'memory','f72d0aeb-1b8f-42ef-baf6-4300296a8a7f')),
  spec('Ports and slots','2 USB-A (one PowerShare), USB-C with DisplayPort (Thunderbolt 3 optional), HDMI 1.4b, RJ-45, audio and microSD.',dell(u5300,'ports-and-connectors','569fac1c-4cc6-484c-a9c4-ca0519eea17d')),
  spec('Battery options','3-cell 42 Wh or 4-cell 60 Wh; actual battery condition is unconfirmed.',dell(u5300,'battery','85a29835-c478-4718-90bc-4bed21de11a0')),
 ],
 'Dell Latitude 5310':[
  spec('Memory support','2 SO-DIMM slots, DDR4-2667, up to 32 GB.',dell(u5310,'memory','f07064b8-2eb4-49ec-88a8-43b102e42417')),
 ],
 'Dell Latitude 5310 x360':[
  spec('Memory support','2 SO-DIMM slots, DDR4-2667, up to 32 GB.',dell(u5310x,'memory','f07064b8-2eb4-49ec-88a8-43b102e42417')),
  spec('Ports and slots','2 USB-A (one PowerShare), USB-C with DisplayPort (Thunderbolt 3 optional), HDMI 1.4, audio, microSD; SIM and smart card optional.',dell(u5310x,'ports-and-connectors','bf77d3d3-74dc-46f0-9288-a41e578b290e')),
  spec('Battery options','3-cell 42 Wh or 4-cell 60 Wh, including long-life option.',dell(u5310x,'battery','cf2a93a5-a7b8-434b-9e59-cd4f943dc54b')),
 ],
 'Dell Latitude 5320':shared5320,'Dell Latitude 5320 x360':shared5320,
 'Dell Latitude 5410':[
  spec('Memory support','2 SO-DIMM slots, up to 32 GB DDR4; speed depends on processor generation.',dell(u5410,'memory','239fc4c1-eca1-47c1-afd1-fc24284c76e9')),
  spec('Graphics options','Intel UHD integrated graphics; AMD Radeon RX 640 2 GB discrete graphics offered on some configurations.',dell(u5410,'video','17b5bb86-4e67-4d23-9e5a-8ecc011ac299')),
  spec('Ports and slots','3 USB-A, USB-C with DisplayPort (Thunderbolt 3 optional), HDMI 1.4b, RJ-45, audio and microSD.',dell(u5410,'ports-and-connectors','3aabd552-e72e-49db-bc78-735fe1734fc9')),
  spec('Battery options','42 Wh, 51 Wh or 68 Wh; actual battery condition is unconfirmed.',dell(u5410,'battery','8993dcc6-9375-4565-9225-f1e4d6aad961')),
  spec('Dimensions','323.05 × 216 × 20.26–21.18 mm; weight varies by configuration.',dell(u5410,'dimensions-and-weight','a2ec334b-aeb0-402e-a579-9d896d8c2df0')),
 ],
 'Dell Latitude 5420':[
  spec('Memory support','2 SO-DIMM slots, DDR4-3200, up to 64 GB.',dell(u5420,'memory','f07064b8-2eb4-49ec-88a8-43b102e42417')),
  spec('Ports and slots','2 USB-A (one PowerShare), 2 Thunderbolt 4 / USB-C with DisplayPort and power delivery, HDMI 2.0, audio and microSD.',dell(u5420,'ports-and-connectors','38d3f374-dd76-4ab5-97ec-d5a0aa87bd32')),
  spec('Battery options','3-cell 42 Wh or 4-cell 63 Wh; actual battery health and runtime vary.',dell(u5420,'battery','415979ac-ae81-4b5b-9137-4a1c6e51299a')),
  spec('Dimensions','321.35 × 212 × 19.30–20.90 mm; weight varies by configuration.',dell(u5420,'dimensions-and-weight','7df32f47-45cf-4a08-ad99-b01eec4f3ce6')),
 ],
 'Dell Latitude 5430':[
  spec('Memory support','2 SO-DIMM slots, DDR4-3200, up to 64 GB.',dell(u5430,'memory','e9d2ea83-38a4-431d-803c-96d63c1dbc34')),
  spec('Ports and slots','RJ-45, 2 USB-A (one PowerShare), 2 Thunderbolt 4 / USB-C, HDMI 2.0, audio and microSD.',dell(u5430,'external-ports','4c4cc1ba-66a4-45f0-8dfc-6013a624ddc0')),
 ],
 'Dell Latitude 5440':[
  spec('Memory support','2 SO-DIMM slots; DDR4-3200 or DDR5-4800/5200 depending on configuration; up to 64 GB.',dell(u5440,'memory','e9d2ea83-38a4-431d-803c-96d63c1dbc34')),
  spec('Graphics option','Some models offer NVIDIA GeForce MX550 with 2 GB GDDR6; not confirmed for this unit.',dell(u5440,'gpudiscrete','4c4dbc78-d958-4370-a96a-02f53b310db2')),
  spec('Battery options','3-cell 42 Wh or 54 Wh; actual battery condition is unconfirmed.',dell(u5440,'battery','14c1215c-2663-4d57-a08a-269ca420fb88')),
  spec('Dimensions','321.35 × 212 × 19.06–21.04 mm; weight depends on configuration.',dell(u5440,'dimensions-and-weight','362133ff-c5e8-4acd-a164-4ce876572659')),
 ],
 'Dell Latitude 7310':[
  spec('Memory support','Onboard DDR4-2666, configurations up to 32 GB.',dell(u7310,'memory','05867936-5f4f-49a0-aba0-bdb592fd6959')),
  spec('Ports and slots','2 USB-A (one PowerShare), 2 USB-C with Thunderbolt 3, DisplayPort and power delivery, HDMI 2.0, audio and microSD.',dell(u7310,'external-ports','6cf5292d-3b53-4087-807e-294a6ac41121')),
  spec('Battery options','3-cell 39 Wh or 4-cell 52 Wh; actual battery condition is unconfirmed.',dell(u7310,'battery','42fd14ca-73af-49b0-9a16-29b15f41b816')),
 ],
 'Dell Latitude 7320':[
  spec('Ports and slots','1 USB-A with PowerShare, 2 Thunderbolt 4 / USB-C with DisplayPort and power delivery, HDMI 2.0, audio and microSD.',dell(u7320,'external-ports','b8f739cc-a41e-4ac9-b3f8-ff6d9c6d8c19')),
  spec('Battery options','3-cell 42 Wh or 4-cell 63 Wh; actual battery condition is unconfirmed.',dell(u7320,'battery','66a2d7e7-0347-4f0d-8ed1-bdeb01fb693f')),
 ],
};

const addDell=(title:string,prefix:string,rows:[string,string,string,string][])=>{profiles[title]=rows.map(([label,value,page,id])=>spec(label,value,dell(prefix,page,id)))};
addDell('Dell Latitude 7300',base+'latitude-13-7300-laptop/lat7300_setup_specifications/',[
 ['Memory support','2 DDR4 SO-DIMM slots, 2400 MHz, up to 32 GB.','memory','2b5b1697-72a5-49dd-99ca-ee3ddfe7f0d0'],
 ['Ports and slots','2 USB-A, USB-C with Thunderbolt, HDMI 1.4a, audio; microSD and smart card optional.','ports-and-connectors','557f8a97-f941-4959-acbf-15a747b63dfb'],
 ['Battery options','42 Wh or 60 Wh; battery condition is unconfirmed.','battery','19363a8f-10c4-4737-9047-61e0939d3c89']]);
addDell('Dell Latitude 7410',base+'latitude-14-7410-2-in-1-laptop/lati_7410_ss/',[
 ['Memory support','Onboard DDR4-2666; configurations up to 32 GB.','memory','05867936-5f4f-49a0-aba0-bdb592fd6959'],
 ['Ports and slots','2 USB-A, 2 Thunderbolt 3 / USB-C, HDMI 2.0, audio and microSD.','external-ports','6cf5292d-3b53-4087-807e-294a6ac41121'],
 ['Battery options','39 Wh, 52 Wh or 68 Wh; battery condition is unconfirmed.','battery','3a48f120-f794-44a7-9f8e-6ca67374e938']]);
addDell('Dell Latitude 5330',base+'latitude-13-5330-laptop/latitude_5330_ss/',[
 ['Memory support','Onboard DDR4-3200, 8–32 GB; not upgradable.','memory','e9d2ea83-38a4-431d-803c-96d63c1dbc34'],
 ['Ports and slots','2 USB-A, 2 Thunderbolt 4 / USB-C, HDMI 2.0, audio, microSD and microSIM.','external-ports','e76109e0-1755-4e8a-918c-51a57e9bc4d9'],
 ['Battery options','3-cell 41 Wh or 4-cell 58 Wh; battery condition is unconfirmed.','battery','4c9ecd4d-5aee-4f60-9b04-604b6013e70e']]);
addDell('Dell Latitude 3320',base+'latitude-13-3320-laptop/lati_3320_ss/',[
 ['Memory support','Integrated LPDDR4x, 4–16 GB; not upgradable. Speed depends on processor.','memory','98f3884c-bf3a-4249-80a0-5564465a61c4'],
 ['Storage options','M.2 2230/2280 PCIe NVMe SSD and Intel Optane options.','storage','6ca64304-ca4a-46ec-8027-6be26d70724b'],
 ['Ports and slots','2 USB-A, USB-C with DisplayPort and power delivery, HDMI 1.4b, audio and microSD.','external-ports','15a9e328-bc0b-4dd6-8333-014b23ce0c12'],
 ['Battery options','3-cell 41 Wh or 4-cell 54 Wh; battery condition is unconfirmed.','battery','11b5fb9a-7970-44bf-b17f-0ee8cdfc2ff2']]);
addDell('Dell Latitude 7280',base+'latitude-12-7280-laptop/latitude_7280_ownersmanual/',[
 ['Memory support','DDR4-2133; Dell lists up to 16 GB.','memory-specifications','7e544f69-3861-412b-a330-75a2a71d7b2c'],
 ['Ports and slots','USB-A, USB-C with DisplayPort (Thunderbolt 3 optional), HDMI 1.4, RJ-45, audio and optional smart card.','port-and-connector-specifications','ddef91d0-146c-4d0e-b0a6-c27d4a9032d1'],
 ['Battery options','3-cell 42 Wh or 4-cell 60 Wh; battery condition is unconfirmed.','battery-specifications','cbd1c4e4-1129-42b2-828d-57e8382d236d']]);
const hpExamples:Record<string,{url:string;rows:[string,string][]}>={
 'HP 250 G8':{url:'https://www.hp.com/emea_middle_east-en/products/laptops/product-details/product-specifications/2100226996',rows:[['Processor example','HP 2W8W9EA specifies Core i5-1035G1 (4 cores); this shop unit’s exact CPU is not confirmed.'],['Graphics example','Intel UHD integrated on HP 2W8W9EA.'],['Memory example','DDR4-2666, two SO-DIMM slots on HP 2W8W9EA.'],['Ports example','2 USB-A, USB-C, RJ-45, HDMI 1.4b, audio and multi-format card reader on HP 2W8W9EA.'],['Battery example','3-cell 41 Wh on HP 2W8W9EA; the shop unit’s battery and health are unconfirmed.']]},
 'HP 430 G7':{url:'https://h20386.www2.hp.com/AustraliaStore/Merch/Product.aspx?id=9UR32PA&opt=&sel=NTB',rows:[['Memory example','HP ProBook 430 G7 9UR32PA: DDR4-2666 with 2 SO-DIMM slots.'],['Ports example','USB-C with DisplayPort and power delivery, 2 USB-A, HDMI 1.4b, RJ-45, audio and SD reader.'],['Wireless example','Wi-Fi 6 AX201 and Bluetooth 5; LTE listed on this reference configuration.'],['Battery example','3-cell 45 Wh; actual unit battery and health unconfirmed.']]},
 'HP 440 G8':{url:'https://www.hp.com/emea_africa-en/products/laptops/product-details/product-specifications/2100412214',rows:[['Memory example','HP ProBook 440 G8 32M52EA: DDR4-3200 with 2 SO-DIMM slots.'],['Ports example','3 USB-A, USB-C with DisplayPort and power delivery, HDMI 1.4b, RJ-45 and audio.'],['Battery example','3-cell 45 Wh; actual unit battery and health unconfirmed.']]},
 'HP EliteBook 830 G8':{url:'https://www.hp.com/my-en/shop/hp-elitebook-830-g8-notebook-pc-3z3u6pa.html',rows:[['Memory example','HP 3Z3U6PA: DDR4-3200 with 2 SO-DIMM slots.'],['Ports example','2 Thunderbolt 4 / USB-C, 2 USB-A, HDMI 2.0b and audio.'],['Battery example','3-cell 53 Wh; actual unit battery and health unconfirmed.']]},
 'HP EliteBook 840 G6':{url:'https://h20386.www2.hp.com/AustraliaStore/Merch/Product.aspx?id=7NW23PA&opt=&sel=NTB',rows:[['Memory example','HP 7NW23PA: DDR4-2400 with 2 SO-DIMM slots.'],['Ports example','2 USB-A, Thunderbolt / USB-C, RJ-45, HDMI 1.4b, audio and docking connector.'],['Camera and audio example','720p camera; stereo speakers and array microphone.']]},
 'HP 840 G7':{url:'https://store.hp.com/SwitzerlandStore/Merch/Product.aspx?id=177B1EA&opt=UUZ&sel=NTB&lang=en-CH',rows:[['Memory example','HP EliteBook 840 G7 177B1EA: DDR4-2666 with 2 SO-DIMM slots.'],['Ports example','2 Thunderbolt USB-C, 2 USB-A, HDMI 1.4 and audio.'],['Wireless example','Wi-Fi 6 AX201 and Bluetooth 5.'],['Battery example','3-cell 53 Wh; actual unit battery and health unconfirmed.']]},
 'HP 250 G7':{url:'https://www.hp.com/cl-es/shop/notebook-hp-250-g7-153b5lt.html',rows:[['Memory example','HP 153B5LT: DDR4-2666 with 2 SO-DIMM slots.'],['Ports example','2 USB 3.1, USB 2.0, HDMI 1.4b, RJ-45, audio and multi-format card reader.'],['Battery example','3-cell 41 Wh; actual unit battery and health unconfirmed.']]},
};
for(const [title,profile] of Object.entries(hpExamples))profiles[title]=profile.rows.map(([label,value])=>spec(label,value,profile.url));
const yoga='https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_L13_Yoga_Gen_2_Intel/ThinkPad_L13_Yoga_Gen_2_Intel_Spec.html';
profiles['Lenovo L13 x360']=[
 spec('Processor options','11th Gen Intel Core i3/i5/i7; exact processor varies.',yoga),spec('Graphics options','Intel UHD or Iris Xe integrated.',yoga),spec('Memory support','Soldered DDR4-3200, 4, 8 or 16 GB; not upgradable.',yoga),spec('Storage options','One M.2 PCIe NVMe SSD; up to 512 GB M.2 2242 or 1 TB M.2 2280 in Lenovo’s tested configurations.',yoga),spec('Ports and slots','2 USB-A, USB-C, Thunderbolt 4, HDMI 2.0, audio, microSD; Ethernet extension and smart card optional.',yoga),spec('Camera and audio','720p front camera; IR and rear cameras optional; stereo speakers and dual microphones.',yoga),spec('Battery and power','Integrated 46 Wh battery; actual battery condition unconfirmed.',yoga),spec('Dimensions and weight','311.5 × 219 × 17.6 mm; starts at 1.44 kg, varies by configuration.',yoga)];
const v15='https://psref.lenovo.com/syspool/Sys/PDF/Lenovo/Lenovo_V15_IML/Lenovo_V15_IML_Spec.html';
profiles['Lenovo V15']=[spec('Processor options','V15 IML: Core i3-10110U or i5-10210U; exact model needs confirmation.',v15),spec('Graphics options','Intel UHD or optional NVIDIA GeForce MX330 2 GB.',v15),spec('Memory support','DDR4-2666, 4 GB soldered plus one SO-DIMM; Lenovo lists up to 12 GB.',v15),spec('Storage options','Up to one 2.5-inch HDD and one M.2 PCIe NVMe SSD.',v15),spec('Ports and slots','2 USB 3.2 Gen 1, USB 2.0, HDMI 1.4b, card reader and audio.',v15),spec('Battery options','35 Wh or 45 Wh; actual battery condition is unconfirmed.',v15),spec('Camera and audio','0.3 MP or 720p camera; stereo speakers and dual microphones.',v15),spec('Dimensions and weight','362.2 × 251.5 × 19.9 mm; starts at 1.85 kg, varies by configuration.',v15)];

const hp840='https://support.hp.com/ee-en/document/c06978058';
profiles['HP 840 G8']=[
 spec('Processor options','HP lists 11th Gen Intel Core i5-1135G7 and i7-1165G7, 4 cores.',hp840),
 spec('Graphics options','Intel Iris Xe; requires a Core i5/i7 and dual-channel memory for Iris Xe capability.',hp840),
 spec('Memory support','DDR4-3200 SO-DIMM configurations up to 64 GB.',hp840),
 spec('Storage options','M.2 PCIe NVMe SSD options from 128 GB to 2 TB; actual drive type must be confirmed.',hp840),
 spec('Ports and slots','2 Thunderbolt 4 / USB-C, 2 USB-A (one charging), HDMI 2.0, audio; smart card and WWAN/SIM optional.',hp840),
 spec('Wireless options','Intel Wi-Fi 6 AX201 and Bluetooth 5; LTE/5G are optional configurations.',hp840),
 spec('Camera and audio','720p HD or optional HD/IR camera; Bang & Olufsen stereo speakers and dual-array microphone.',hp840),
 spec('Battery and power','3-cell 56 Wh battery; 45 W or 65 W adapter options. Actual battery health is unconfirmed.',hp840),
 spec('Dimensions and weight','323.3 × 214.6 × 17.8 mm; from 1.35 kg non-touch or 1.46 kg touch, depending on configuration.',hp840),
];
const l13='https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_L13/ThinkPad_L13_Spec.html';
const l13g2='https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_L13_Gen_2_Intel/ThinkPad_L13_Gen_2_Intel_Spec.html';
function thinkpadL13(gen2:boolean):ManufacturerSpec[]{const url=gen2?l13g2:l13;return [
 spec('Processor options',gen2?'11th Gen Intel Core i3/i5/i7 and Celeron options; exact CPU varies.':'10th Gen Intel Core i3/i5/i7 and Celeron options; exact CPU varies.',url),
 spec('Graphics options',gen2?'Intel UHD or Iris Xe integrated graphics, depending on configuration.':'Intel UHD integrated graphics.',url),
 spec('Memory support',`Soldered DDR4${gen2?'-3200':'-2400 or DDR4-2666'}, 4, 8 or 16 GB configurations; no memory slots.`,url),
 spec('Storage options','One M.2 PCIe NVMe SSD; supports up to 512 GB M.2 2242 or 1 TB M.2 2280 in Lenovo’s tested configurations.',url),
 spec('Ports and slots',gen2?'2 USB-A, USB-C, Thunderbolt 4, HDMI 2.0, audio, microSD; Ethernet extension and smart card optional.':'2 USB-A, 2 USB-C, HDMI 1.4b, Ethernet extension, audio and microSD; smart card optional.',url),
 spec('Wireless options','Intel Wireless-AC 9560 or Wi-Fi 6 AX201 with Bluetooth, depending on configuration.',url),
 spec('Camera and audio','720p camera, optional IR; two 2 W speakers and dual-array microphones.',url),
 spec('Battery and power','Integrated 46 Wh battery; 45 W or 65 W USB-C adapter options. Actual battery health is unconfirmed.',url),
 spec('Dimensions and weight',`311.5 × 219 × 17.6 mm; ${gen2?'from 1.39 kg':'around 1.38 kg'}, varies by configuration.`,url),
 ];}
export function manufacturerDetails(p:Product):ManufacturerSpec[]{
 if(p.title==='Lenovo L13' && /10th|11th/i.test(p.cpu))return thinkpadL13(/11th/i.test(p.cpu));
 if(p.title==='Lenovo L13 x360' && !/11th/i.test(p.cpu))return [];
 return profiles[p.title]||[];
}
