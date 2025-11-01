'use client';

import { Box, Container, Stepper, Step, StepLabel, useTheme, useMediaQuery } from '@mui/material';

interface BookingStepperProps {
  currentStep: number;
}

const steps = ['Search', 'Selection', 'Review', 'Confirmation'];

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="md">
        <Stepper
          activeStep={currentStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'success.main',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main',
            },
            '& .MuiStepLabel-label.Mui-completed': {
              fontWeight: 600,
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 700,
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={currentStep > index}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
    </Box>
  );
}