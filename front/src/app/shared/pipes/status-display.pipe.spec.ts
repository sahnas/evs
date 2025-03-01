import { StatusDisplayPipe } from './status-display.pipe';

describe('StatusDisplayPipe', () => {
  let pipe: StatusDisplayPipe;

  beforeEach(() => {
    pipe = new StatusDisplayPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "Confirmé" to "Confirmé"', () => {
    expect(pipe.transform('Confirmé')).toBe('Confirmé');
  });

  it('should transform "Annulé" to "Annulé"', () => {
    expect(pipe.transform('Annulé')).toBe('Annulé');
  });

  it('should transform "Recherche de place" to "En recherche de place"', () => {
    expect(pipe.transform('Recherche de place')).toBe('En recherche de place');
  });

  it('should transform "A organiser" to "À organiser"', () => {
    expect(pipe.transform('A organiser')).toBe('À organiser');
  });

  it('should return the original value for unknown status', () => {
    expect(pipe.transform('Status inconnu')).toBe('Status inconnu');
  });
});
