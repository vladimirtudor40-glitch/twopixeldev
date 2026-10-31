import Gate from '@/components/Gate';
import { display, mono } from './fonts';

export default function Home() {
  return (
    <main className="stage">
      <h1 className="sr-only">twopixeldev</h1>
      <Gate displayFont={display.style.fontFamily} monoFont={mono.style.fontFamily} />
    </main>
  );
}
