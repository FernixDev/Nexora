import { useState } from 'react';
import { Button } from '../components/Button/Button';
import { GlassCard } from '../components/GlassCard/GlassCard';
import { Input } from '../components/Input/Input';
import { Badge } from '../components/Badge/Badge';
import { Progress } from '../components/Progress/Progress';
import { IconButton } from '../components/IconButton/IconButton';
import { SectionHeader } from '../components/SectionHeader/SectionHeader';
import { BottomNav, type BottomNavItem } from '../components/BottomNav/BottomNav';
import {
  HomeIcon,
  TrainIcon,
  PlansIcon,
  ProgressIcon,
  ProfileIcon,
  CheckIcon,
} from '../components/icons';
import './DesignSystemPage.css';

const NAV_ITEMS: BottomNavItem[] = [
  { id: 'home', label: 'Inicio', icon: <HomeIcon /> },
  { id: 'train', label: 'Entrenar', icon: <TrainIcon /> },
  { id: 'plans', label: 'Planes', icon: <PlansIcon /> },
  { id: 'progress', label: 'Progreso', icon: <ProgressIcon /> },
  { id: 'profile', label: 'Perfil', icon: <ProfileIcon /> },
];

const COLOR_TOKENS = [
  'color-bg',
  'color-bg-elevated',
  'color-surface',
  'color-surface-glass',
  'color-text',
  'color-text-secondary',
  'color-text-muted',
  'color-border',
  'color-brand',
  'color-success',
  'color-warning',
  'color-error',
  'color-info',
];

export function DesignSystemPage() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <main className="ds-page">
      <header className="ds-header">
        <span className="text-label text-muted">Herramienta interna de desarrollo</span>
        <h1 className="text-title">Design System — Nexora</h1>
        <p className="text-body text-secondary">
          Esta vista no forma parte de la experiencia final de la app. Sirve para revisar
          visualmente los tokens y componentes reutilizables.
        </p>
        <a className="text-small" href="#">
          ← Volver a la bienvenida
        </a>
      </header>

      <section className="ds-section">
        <SectionHeader eyebrow="Tokens" title="Colores" description="Modo claro / oscuro según el sistema" />
        <div className="ds-color-grid">
          {COLOR_TOKENS.map((token) => (
            <div key={token} className="ds-color-swatch">
              <span className="ds-color-chip" style={{ background: `var(--${token})` }} />
              <span className="text-small text-secondary">{token}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Tokens" title="Tipografía" />
        <div className="ds-type-list">
          <p className="text-display">Display</p>
          <p className="text-title">Título principal</p>
          <p className="text-heading">Encabezado de sección</p>
          <p className="text-subtitle">Subtítulo</p>
          <p className="text-body">Cuerpo de texto para contenido general de la aplicación.</p>
          <p className="text-small text-secondary">Texto pequeño / ayuda</p>
          <p className="text-label text-muted">Etiqueta</p>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="Botones" />
        <div className="ds-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="ds-row">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className="ds-row">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button trailingIcon={<CheckIcon />}>Con icono</Button>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="Inputs" />
        <div className="ds-input-grid">
          <Input label="Nombre" placeholder="Tu nombre" helperText="Como quieres que te llamemos" />
          <Input label="Email" placeholder="tu@email.com" error="Introduce un email válido" />
          <Input label="Peso (kg)" placeholder="70" disabled />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="Badges" />
        <div className="ds-row">
          <Badge tone="info">Principiante</Badge>
          <Badge tone="brand">Intermedio</Badge>
          <Badge tone="warning">Avanzado</Badge>
          <Badge tone="success">Completado</Badge>
          <Badge tone="neutral">En progreso</Badge>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="GlassCard" />
        <div className="ds-card-grid">
          <GlassCard level="subtle">
            <p className="text-heading">Subtle</p>
            <p className="text-small text-secondary">Uso discreto, contenido secundario.</p>
          </GlassCard>
          <GlassCard level="medium">
            <p className="text-heading">Medium</p>
            <p className="text-small text-secondary">Superficie estándar para tarjetas.</p>
          </GlassCard>
          <GlassCard level="strong" onClick={() => undefined}>
            <p className="text-heading">Strong (interactiva)</p>
            <p className="text-small text-secondary">Es un botón real, con hover y foco.</p>
          </GlassCard>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="Progreso" />
        <div className="ds-progress-list">
          <Progress value={35} label="Semana actual" />
          <Progress value={70} label="Plan de fuerza" />
          <Progress value={100} label="Objetivo mensual" />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeader eyebrow="Componentes" title="IconButton" />
        <div className="ds-row">
          <IconButton icon={<HomeIcon />} label="Inicio" variant="glass" />
          <IconButton icon={<TrainIcon />} label="Entrenar" variant="solid" />
          <IconButton icon={<ProfileIcon />} label="Perfil" variant="ghost" />
        </div>
      </section>

      <section className="ds-section ds-section--nav">
        <SectionHeader
          eyebrow="Navegación"
          title="Bottom navigation"
          description="Cápsula expandible. Toca el destino activo para abrirla, elige otro para navegar, o cierra con clic fuera / Escape."
        />
        <p className="text-small text-muted">Activo: {activeNav}</p>
      </section>

      <BottomNav items={NAV_ITEMS} activeId={activeNav} onChange={setActiveNav} />
    </main>
  );
}
