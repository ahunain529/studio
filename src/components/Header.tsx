import { TalcTrackLogo } from './TalcTrackLogo';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 border-b border-border/50 bg-card/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-4">
        <TalcTrackLogo />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          TalcTrack
        </h1>
      </div>
    </header>
  );
}
