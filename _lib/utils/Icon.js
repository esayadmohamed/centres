import * as LucideIcons from "lucide-react";

export default function Icon({ name, fill = "none", color = "black" }) {
    const LucideIcon = LucideIcons[name];
    
    return LucideIcon ? (
        <LucideIcon fill={fill} color={color} />
    ) : null;
}


// import * as LucideIcons from "lucide-react";

// export default function Icon({name}) {
//     const LucideIcon = LucideIcons[name];
//     return LucideIcon ? 
//                 <LucideIcon /> 
//             : null;
// }

