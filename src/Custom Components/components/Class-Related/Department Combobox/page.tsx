// import React from 'react';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// const departments = [
//   "Aerospace Engineering, Department of",
//   "African American Studies, Department of",
//   "Agricultural Communications Program",
//   "Agricultural Leadership Education and Communication Program",
//   "Agricultural and Biological Engineering, Department of",
//   "American Indian Studies Program",
//   "Animal Sciences, Department of",
//   "Anthropology, Department of",
//   "Architecture, School of",
//   "Art and Design, School of",
//   "Asian American Studies, Department of",
//   "Astronomy, Department of",
//   "Biochemistry, Department of",
//   "Bioengineering, Department of",
//   "Business Administration, Department of",
//   "Cell and Developmental Biology, Department of",
//   "Chemical and Biomolecular Engineering, Department of",
//   "Chemistry, Department of",
//   "Civil and Environmental Engineering, Department of",
//   "Classics, Department of the",
//   "Climate, Meteorology and Atmospheric Sciences, Department of",
//   "Communication, Department of",
//   "Comparative and World Literature",
//   "Crop Sciences, Department of",
//   "Dance, Department of",
//   "Earth Science and Environmental Change",
//   "Earth, Society and Environment, School of",
//   "East Asian Languages and Cultures, Department of",
//   "Economics, Department of",
//   "Electrical and Computer Engineering, Department of",
//   "English, Department of",
//   "Entomology, Department of",
//   "Evolution, Ecology, and Behavior, Department of",
//   "Food Science and Human Nutrition, Department of",
//   "French & Italian, Department of",
//   "Gender and Women's Studies, Department of",
//   "Geography & Geographic Information Science, Department of",
//   "Germanic Languages and Literatures, Department of",
//   "Health and Kinesiology, Department of",
//   "History, Department of",
//   "Human Development & Family Studies, Department of",
//   "Industrial and Enterprise Systems Engineering, Department of",
//   "Information Sciences, School of",
//   "Integrative Biology, School of",
//   "Interdisciplinary Health Sciences (i-Health)",
//   "Labor and Employment Relations, School of",
//   "Landscape Architecture, Department of",
//   "Latina/Latino Studies, Department of",
//   "Library Administration, University of Illinois",
//   "Linguistics, Department of",
//   "Literatures, Cultures and Linguistics, School of",
//   "Materials Science and Engineering, Department of",
//   "Mathematics, Department of",
//   "Mechanical Science and Engineering, Department of",
//   "Media, College of",
//   "Microbiology, Department of",
//   "Molecular and Integrative Physiology, Department of",
//   "Music, School of",
//   "Natural Resources and Environmental Sciences, Department of",
//   "Philosophy, Department of",
//   "Physics, Department of",
//   "Plant Biology, Department of",
//   "Political Science, Department of",
//   "Psychology, Department of",
//   "Religion, Department of",
//   "Siebel School of Computing and Data Science",
//   "Slavic Languages and Literatures, Department of",
//   "Social Work, School of",
//   "Sociology, Department of",
//   "Spanish and Portuguese, Department of",
//   "Speech and Hearing Science, Department of",
//   "Statistics, Department of",
//   "Theatre, Department of",
//   "Urban and Regional Planning, Department of",
//   "Veterinary Medicine, College of"
// ];

// const DepartmentCombobox = ({ value, onChange }) => {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between bg-white dark:bg-gray-700"
//         >
//           {value || "Select department..."}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder="Search department..." />
//           <CommandEmpty>No department found.</CommandEmpty>
//           <CommandGroup>
//             {departments.map((department) => (
//               <CommandItem
//                 key={department}
//                 value={department}
//                 onSelect={(currentValue) => {
//                   onChange(currentValue);
//                   setOpen(false);
//                 }}
//               >
//                 <Check
//                   className={cn(
//                     "mr-2 h-4 w-4",
//                     value === department ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {department}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default DepartmentCombobox;

// {/* <DepartmentCombobox 
//   value={professorFormData.department}
//   onChange={(value) => setProfessorFormData(prev => ({ ...prev, department: value }))}
// /> */}