; Installer „Caută leaduri” — twopixeldev
; Build: tools\cauta-leaduri\build.ps1 (compilează aplicația și apoi rulează ISCC pe acest fișier).
; Așteaptă în installer\payload\: CautaLeaduri.exe și gmaps-scraper.exe (versiunea reparată, nu cea de pe GitHub).

#define AppName "Caută leaduri"
#define AppVersion "1.0.0"

[Setup]
AppId={{7C2B3E4A-5D1F-4F8B-9A61-2E0D7B1C9F55}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher=twopixeldev
AppPublisherURL=https://twopixeldev.com
AppSupportURL=https://twopixeldev.com
DefaultDirName={localappdata}\Programs\CautaLeaduri
DefaultGroupName=twopixeldev
DisableProgramGroupPage=yes
DisableDirPage=yes
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=CautaLeaduri-twopixeldev-Setup
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\icon.ico
UninstallDisplayName={#AppName} · twopixeldev
WizardStyle=modern
WizardImageFile=wizard-164x314.bmp,wizard-328x628.bmp
WizardSmallImageFile=small-55x55.bmp,small-110x110.bmp
WizardImageStretch=no
Compression=lzma2/max
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
CloseApplications=yes

[Languages]
Name: "ro"; MessagesFile: "Romanian.isl"

[Messages]
ro.WelcomeLabel1=Bine ai venit în Caută leaduri
ro.WelcomeLabel2=Instrumentul twopixeldev care găsește pe Google Maps firmele fără site.%n%nRezultatele se salvează în Documente\Leaduri și se încarcă în twopixeldev.com/app → Site-uri → importă leaduri.
ro.FinishedHeadingLabel=Gata, Caută leaduri e instalat

[Tasks]
Name: "desktopicon"; Description: "Scurtătură pe Desktop"; GroupDescription: "Scurtături:"

[Files]
Source: "payload\CautaLeaduri.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "payload\gmaps-scraper.exe"; DestDir: "{app}\scraper"; Flags: ignoreversion
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\CautaLeaduri.exe"; IconFilename: "{app}\icon.ico"; Comment: "Găsește firme fără site pe Google Maps"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\CautaLeaduri.exe"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon
Name: "{autoprograms}\Dezinstalează {#AppName}"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\CautaLeaduri.exe"; Description: "Deschide Caută leaduri"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "{cmd}"; Parameters: "/C taskkill /F /T /IM CautaLeaduri.exe"; Flags: runhidden; RunOnceId: "KillApp"
