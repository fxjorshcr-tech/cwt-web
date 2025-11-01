// src/components/layout/Navbar.tsx
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container 
} from '@mui/material';

// URL de tu logo de Supabase
const LOGO_URL = 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-logo-white.png'; 

export default function Navbar() {
  return (
    <AppBar 
      position="absolute"
      elevation={0}
      sx={{ backgroundColor: 'transparent', zIndex: 1000 }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
          
          {/* Logo */}
          <Box>
            {/* **LA CORRECCIÓN, PARTE 1:**
              Eliminamos 'passHref', ya no es necesario con App Router.
              El <Link> de Next.js renderiza la etiqueta <a> por sí mismo.
            */}
            <Link href="/">
              {/* **LA CORRECCIÓN, PARTE 2:**
                Eliminamos 'component="a"'. 
                Este Box es ahora un simple <div> (por defecto) DENTRO del <a> del Link.
                Esto elimina el error <a> dentro de <a>.
              */}
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Image 
                  src={LOGO_URL} 
                  alt="CWT Shuttle Service Logo" 
                  width={240}
                  height={50}
                  priority 
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Link>
          </Box>

          {/* Enlaces de Navegación (Estos ya estaban correctos) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" component={Link} href="/" sx={{ color: 'common.white', fontWeight: 'bold' }}>Home</Button>
            <Button color="inherit" component={Link} href="/transfers" sx={{ color: 'common.white', fontWeight: 'bold' }}>Transfers</Button>
            <Button color="inherit" component={Link} href="/about" sx={{ color: 'common.white', fontWeight: 'bold' }}>About</Button>
            <Button color="inherit" component={Link} href="/contact" sx={{ color: 'common.white', fontWeight: 'bold' }}>Contact</Button>
            <Button 
              variant="contained" 
              color="primary"
              component={Link} 
              href="/book" 
              sx={{ fontWeight: 'bold' }}
            >
              Book
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}