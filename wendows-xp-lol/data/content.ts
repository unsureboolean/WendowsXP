

import { Notepad } from '../components/apps/Notepad';
import { SystemInfoWindow } from '../components/apps/SystemInfoWindow';
import { PersonaZoo } from '../components/apps/PersonaZoo';
import { GridlockApp } from '../components/apps/GridlockApp';
import { Browser } from '../components/apps/Browser';
import { MusicPlayer } from '../components/apps/IframeApp';
import type { DesktopItem, AppConfig } from '../types';

const NotepadApp: AppConfig<string> = {
  type: 'Notepad',
  component: Notepad,
};

const PersonaZooApp: AppConfig<null> = {
  type: 'PersonaZooApp',
  component: PersonaZoo,
};

const GridlockAppConfig: AppConfig<null> = {
  type: 'GridlockApp',
  component: GridlockApp,
};

const SystemInfoApp: AppConfig<null> = {
    type: 'SystemInfoApp',
    component: SystemInfoWindow,
};

const BrowserApp: AppConfig<{ initialUrl: string }> = {
  type: 'BrowserApp',
  component: Browser,
};

const MusicPlayerApp: AppConfig<{ fileUrl: string; fileName: string; }> = {
  type: 'MusicPlayerApp',
  component: MusicPlayer,
};


const aboutMeContent = `Hello! My name is Jeff.

I'm not a professional developer, but I have a deep passion for technology. I love learning how things work, tinkering with code, and building fun projects like this one.

This website is a nostalgic throwback to the Windows XP era, a time that sparked my curiosity in computers. Feel free to explore and see what I've been working on!
`;

const projectsContent = `Here are some of my key projects. You can open them from the desktop or the Start Menu.

- Instant Messenger: A mock-up of a classic IM client, demonstrating component-based UI in React.
- Gridlock: A concept for a futuristic puzzle game, built as a static React component.
- This Portfolio: A fun project to recreate a classic OS experience using React and Tailwind CSS.
`;

const contactContent = `You can find me on these platforms:

GitHub: https://github.com/unsureboolean
LinkedIn: [Your LinkedIn Profile URL]
Email: [Your Email Address]

Feel free to reach out!
`;

const myDocumentsContent = `A collection of very important files.

---

File: motivational_poster_ideas.txt

1. SYNERGY: It's what's for dinner. (Picture of eagles high-fiving)
2. TEAMWORK: Because not everyone can be a rockstar. Some of us have to be roadies. (Picture of a blurry concert)
3. INNOVATION: Think outside the box, but inside the budget. (Picture of a lightbulb in a piggy bank)
4. MONDAYS: The only thing worse is Tuesdays. (Picture of a sad cat in a tie)

---

File: email_to_sandra_re_tps_reports.txt

Subject: Re: Re: Fwd: TPS Reports

Sandra,

Per my last email, please ensure the cover sheets are attached to the TPS reports. I've attached the memo regarding the new cover sheets. I'll swing by your desk later to circle back and touch base on this.

Best,
Jeff

P.S. Did you see the latest cat video? Forwarding now.

---

File: top_secret_project_ideas.txt

- A toaster that also prints the news on your toast.
- Scented mouse pads (flavors: "New Computer Smell", "Office Coffee", "Quiet Desperation").
- An AI that just agrees with everything I say.

`;
const myMusicContent = `This folder is a placeholder for your music. Your digital collection of albums and songs would be organized here.`;
const controlPanelContent = `The Control Panel is the central hub for all system settings. From here, you could change display properties, add or remove programs, configure network settings, and much more. This is a placeholder for that functionality.`;


export const DESKTOP_ITEMS: DesktopItem[] = [
  {
    id: 'im',
    name: 'Instant Messenger',
    icon: 'im',
    app: PersonaZooApp,
    data: null,
  },
  {
    id: 'gridlock',
    name: 'Gridlock',
    icon: 'grid',
    app: GridlockAppConfig,
    data: null,
  },
  {
    id: 'about',
    name: 'About Me.txt',
    icon: 'file',
    app: NotepadApp,
    data: aboutMeContent,
  },
  {
    id: 'ie',
    name: 'Internet Explorer',
    icon: 'ie',
    app: BrowserApp,
    data: { initialUrl: 'https://www.google.com/webhp?igu=1' },
  },
];

export const START_MENU_ITEMS: DesktopItem[] = [
  ...DESKTOP_ITEMS,
  {
    id: 'projects',
    name: 'Projects.txt',
    icon: 'file',
    app: NotepadApp,
    data: projectsContent,
  },
  {
    id: 'contact',
    name: 'Contact.txt',
    icon: 'file',
    app: NotepadApp,
    data: contactContent,
  },
];

export const START_MENU_SYSTEM_ITEMS: DesktopItem[] = [
    {
        id: 'my-documents',
        name: 'My Documents',
        icon: 'folder',
        app: NotepadApp,
        data: myDocumentsContent,
    },
    {
        id: 'my-pictures',
        name: 'My Pictures',
        icon: 'folder',
        app: BrowserApp,
        data: { initialUrl: 'https://i.imgflip.com/2/320q7d.jpg' },
    },
    {
        id: 'my-music',
        name: 'My Music',
        icon: 'folder',
        app: MusicPlayerApp,
        data: { 
            fileUrl: 'https://www.myinstants.com/media/sounds/nokia-tune-polyphonic.mp3',
            fileName: 'Nokia Tune (Polyphonic).mp3'
        },
    },
    {
        id: 'my-computer-sm',
        name: 'My Computer',
        icon: 'computer',
        app: SystemInfoApp,
        data: null,
    },
    {
        id: 'control-panel',
        name: 'Control Panel',
        icon: 'app',
        app: NotepadApp,
        data: controlPanelContent,
    }
];