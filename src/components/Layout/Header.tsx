import Link from 'next/link';

type Props = {
  title: string;
  link: LinkProp;
};

type LinkProp = {
  title: string;
  link: string;
}

export const Header = ({
  title,
  link
}: Props) => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        {link && <div>
          <Link
            href={link.link}
            className="justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm"
          >{link.title}</Link>
        </div>}
      </div>
    </header>
  );
}