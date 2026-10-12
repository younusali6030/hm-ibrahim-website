# /indore: story rewrite, DRAFT for owner review

Status: copy and plan only. Nothing in `app/` or `content/` has been changed.

## 1. SEO research (OpenSEO, India, Oct 2026)

| Keyword | Monthly searches | Difficulty | Note |
|---|---|---|---|
| loha mandi indore | 1,900 | 0 | Biggest. Page should own "Loha Mandi" and Siyaganj as places. |
| siyaganj indore | 1,600 | 0 | Place query. Today nobody on the page explains what Siyaganj is. |
| hardware shop in indore | 880 | 0 | Local pack is full of directories (JustDial, IndiaMart). |
| hardware store indore | 880 | 0 | Same SERP. |

Other terms tried returned no volume (too small to measure): wire mesh indore, jali indore, tmt bar dealers indore, Hindi variants. They stay as supporting terms, covered by the existing six /indore/[slug] pages.

SERP read: for "iron hardware shop in indore" the local pack is Vishwas Hardware, A.A. Khambati & Sons (also Siyaganj Main Rd) and Patil Hardware. Below that it is JustDial, IndiaMart and a YouTube market video. No one owns a page that explains the Siyaganj iron market and who has built Indore with it. That is the gap.

Targets
- Title: `Iron & Hardware in Indore | Loha Mandi, Siyaganj since 1939 | HM Ibrahim & Co`
- H1: how the shop has grown with Indore (see copy).
- Primary: loha mandi indore, siyaganj indore, iron hardware shop in indore.
- Secondary: hardware shop in indore, iron market indore.

## 2. Page structure

1. Hero. Indore skyline or Rajwada image with the existing shopfront. One CTA.
2. "Indore built by hand, and by iron." Our story, first person plural.
3. Who we have supplied. A ruled ledger (not a card grid): school, hotel, food, factory, farm.
4. Indore, as we have watched it grow. Editorial strip with 4 landmark images and captions.
5. What we are aiming at. Short promise.
6. What Indore buys from us. Existing ledger, kept.
7. Where we deliver. Existing, kept.
8. FAQ with schema (Siyaganj, Loha Mandi, retail vs wholesale, delivery, farmers).
9. Reviews and contact strip. Existing, kept.

Motifs: one GaugeRule per section at most, one CounterStamp ("Siyaganj, since 1939") on the story block. No new patterns.

## 3. Copy draft (English; Hindi to follow once you approve tone)

### Hero
Eyebrow: Indore, Madhya Pradesh
H1: **We have sold iron to Indore since 1939. We watched it grow.**
Lede: Every gate, godown, shed and fence in this city has needed someone to supply the steel. For four generations, that has been one counter on Siyaganj Main Road.

### Our story
From the day H.M. Ibrahim opened the counter, the work has been simple. A customer says what the job is. We find the right iron, wire or hardware, and we stand behind it.

Indore around us changed a lot. Lanes became roads. Open plots became colleges, hotels, factories. We did not build those buildings, but we supplied the people who did, and we were there for the next order every time.

Three generations on, the counter is the same and so is the promise: right material, fair rate, no games.

### Who we have supplied
Big or small, the same counter and the same rate discipline.

| Who | What it looks like |
|---|---|
| Daly College | Boundary fencing and hardware for one of Indore's oldest schools. |
| Radisson | Steel and hardware for the hotel trade. |
| Apna Sweets | Supply for a name every Indori knows. |
| Factories in Pithampur | Mesh, wire, sections and fittings for industrial work. |
| Farmers across MP | Barbed wire, chain link and fencing for fields. |

*(Owner to confirm exactly what we supplied to each, so the second column is true, not generic.)*

### Indore, as we have watched it grow
Captions to sit under images. No claim that we supplied these places.
- Rajwada: "The city's old heart is a few minutes from our counter."
- Lal Bagh Palace: "Where Indore's history sits. We work a short drive away."
- Daly College: "A school we are proud to have supplied."
- Siyaganj and Loha Mandi: "The markets Indore has bought iron in for generations."

### What we are aiming at
Indore is now one of India's fastest-growing cities, and it needs honest supply to keep growing. We want to be the counter that builders, factories and farmers in this region trust first. Same material, same rate for everyone. We grow when Indore grows.

### FAQ (schema)
1. Where is HM Ibrahim & Co? 60 Siyaganj Main Road, opp. Tijori Gali, Indore 452007.
2. Do you sell retail as well as wholesale? Yes, both.
3. What is Loha Mandi / Siyaganj? Indore's long-standing iron and hardware trading area. Our counter has been there since 1939.
4. Do you supply outside Indore? Yes: Dewas, Ujjain, Mhow, Pithampur and across MP.
5. Do you supply farmers? Yes, fencing wire, barbed wire and chain link.

## 4. Images

Source: Wikimedia Commons only (freely licensed, with attribution on the page). I will verify each licence before using an image and record author and licence in an on-page credit line.

Candidate subjects: Rajwada, Lal Bagh Palace, Daly College, Indore skyline or city street, Siyaganj / market lane if available.
Fallback if a good licensed image does not exist: use our own shopfront photo and a text caption, not a weak or mis-licensed image.

Processing: responsive-image-pipeline (AVIF/WebP, correct `sizes`, LQIP), proper alt text, `priority` only on the hero.

## 5. Needs you before I build
1. Confirm client names in the ledger can be shown publicly (Daly College, Radisson, Apna Sweets). Design system rule says no invented client names, and these are from you, so I want your explicit OK.
2. One true detail for each client, for example "fencing for the boundary" or "mesh for ...".
3. Approve the tone of the story copy, and I will write the Hindi version.
4. OK on Wikimedia Commons as the image source.
