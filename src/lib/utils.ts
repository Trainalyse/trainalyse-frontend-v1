import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*i dont quite understand what the logic is but this files job is lets say for example we have conflicting
styles in a classname like p2 and p4 so tailwind and browser are the 2 actor here which dont have a fixed logic as to
which style should win and i dont get that like why does tailwind and browser does that like tailwind will
give these styles in a specific order which is set and does not change and browser will apply it universally
so what this file does it merges the 2 classes and applies the logic that whichever class appeared at last will win
so in this case p4 will win and will be applied and without this file the winner would be unpredictable.*/
