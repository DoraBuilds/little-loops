import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountSettingsCard } from '@/components/AccountSettingsCard';

// Radix AlertDialog uses portals + focus-locking that can be flaky in JSDOM.
// For this unit test, we only care that the delete action exists and calls the hook.
vi.mock('@/components/ui/alert-dialog', () => {
  const passthrough =
    (Tag: keyof JSX.IntrinsicElements = 'div') =>
    ({ children, asChild: _asChild, ...props }: { children?: React.ReactNode; asChild?: boolean } & Record<string, unknown>) =>
      React.createElement(Tag, props, children);

  const AlertDialog = passthrough('div');
  const AlertDialogTrigger = passthrough('div');
  const AlertDialogContent = passthrough('div');
  const AlertDialogHeader = passthrough('div');
  const AlertDialogTitle = passthrough('div');
  const AlertDialogDescription = passthrough('div');
  const AlertDialogFooter = passthrough('div');
  const AlertDialogCancel = passthrough('button');
  const AlertDialogAction = passthrough('button');

  return {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  };
});

const sendEmailLink = vi.fn();
const signOut = vi.fn();
const deleteAccount = vi.fn();
const clearError = vi.fn();
const retryHousehold = vi.fn();
const authState = {
  configured: true,
  status: 'signed_out',
  user: null,
  householdStatus: 'idle',
  household: null,
  error: null as string | null,
  clearError,
  sendEmailLink,
  retryHousehold,
  signOut,
  deleteAccount,
};

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => authState,
}));

describe('AccountSettingsCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendEmailLink.mockResolvedValue(true);
    deleteAccount.mockResolvedValue(true);
    authState.configured = true;
    authState.status = 'signed_out';
    authState.user = null;
    authState.householdStatus = 'idle';
    authState.household = null;
    authState.error = null;
  });

  it('uses email link copy instead of password fields', () => {
    render(<AccountSettingsCard />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const createButtons = screen.getAllByRole('button', { name: /^create account$/i });
    expect(createButtons.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/parent name/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/at least 6 characters/i)).toBeNull();
  });

  it('shows a success message after sending the sign-up link', async () => {
    render(<AccountSettingsCard />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. dora/i), { target: { value: 'Dora' } });
    fireEvent.change(screen.getByPlaceholderText(/parent@example.com/i), {
      target: { value: 'parent@example.com' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /^create account$/i })[1]);

    await waitFor(() => {
      expect(sendEmailLink).toHaveBeenCalledWith('parent@example.com', 'signup', { parentName: 'Dora' });
    });

    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/parent@example.com/i)).toBeInTheDocument();
  });

  it('shows actionable guidance when household bootstrap fails', () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'error';
    authState.error =
      'Could not prepare the family household in Supabase. The shared household schema appears to be missing in the live Supabase project. Apply the household SQL migration, then try again.';

    render(<AccountSettingsCard />);

    expect(screen.getByText(/shared household schema appears to be missing/i)).toBeInTheDocument();
    expect(screen.getByText(/after the supabase household schema is applied/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('offers account deletion when signed in', async () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'ready';
    authState.household = { id: 'household-1', name: 'Test Family', timezone: 'UTC', created_by_user_id: 'user-1' };

    render(<AccountSettingsCard />);

    // First click shows the inline confirmation
    fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));

    // Confirm with the "Yes, delete it" button
    fireEvent.click(await screen.findByRole('button', { name: /yes, delete it/i }));

    await waitFor(() => {
      expect(deleteAccount).toHaveBeenCalledTimes(1);
    });
  });
});
