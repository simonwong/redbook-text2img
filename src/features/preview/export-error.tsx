export function ExportError({ message }: { message: string }) {
  return message ? (
    <p className="relative px-4 py-2 text-destructive text-sm" role="alert">
      {message}
    </p>
  ) : null;
}
